pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./Kiosk.sol";
import "./DINRegistry.sol";
import "./OrderMaker.sol";
import "./OrderStore.sol";
import "./Market.sol";
import "./OrderUtils.sol";

contract Buy {
    // Kiosk protocol
    Kiosk public kiosk;
    KioskMarketToken public KMT;
    DINRegistry public registry;
    OrderMaker public orderMaker;
    OrderStore public orderStore;

    // The DIN to buy a DIN.
    uint256 public GENESIS_DIN = 1000000000;

    string public version = "0.0.1";

    enum Errors {
        INSUFFICIENT_BALANCE,
        INCORRECT_PRICE,
        PRODUCT_NOT_AVAILABLE,
        NOT_FULFILLED
    }

    modifier only_KMT {
        require (KMT == msg.sender);
        _;
    }

    event LogError(uint8 indexed errorId);
    event LogBuyDIN(uint256 DIN);

    // Constructor
    function Buy(Kiosk _kiosk) {
        kiosk = _kiosk;
        updateKiosk();
    }

    /**
    *  ==============================
    *              Buy
    *  ==============================
    */

    /**
    * @dev Buy a product.
    * @param DIN The Decentralized Identification Number (DIN) of the product to buy.
    * @param quantity The quantity to buy.
    * @param totalValue The total price of the product(s) in Kiosk Market Token (KMT) base units (i.e. "wei").
    * @return The order ID generated from the OrderStore.
    */
    function buy(uint256 DIN, uint256 quantity, uint256 totalValue) public returns (uint256 orderID) {
        // Get the Market.
        address marketAddr = registry.market(DIN);
        Market market = Market(marketAddr);

        // The buyer must have enough tokens for the purchase.
        if (KMT.balanceOf(msg.sender) < totalValue) {
            LogError(uint8(Errors.INSUFFICIENT_BALANCE));
            return 0;
        }

        // The total value must match the value on the market.
        if (market.totalPrice(DIN, quantity, msg.sender) != totalValue) {
            LogError(uint8(Errors.INCORRECT_PRICE));
            return 0;
        }

        // The requested quantity must be available for sale.
        if (market.availableForSale(DIN, quantity, msg.sender) == false) {
            LogError(uint8(Errors.PRODUCT_NOT_AVAILABLE));
            return 0;
        }

        // If conditions are met, call the private executeOrder method to complete the transaction.
        return executeOrder(
            DIN,
            quantity,
            totalValue,
            msg.sender,  // Buyer
            market,
            false        // No off-chain price changes validated
        );
    }

    // Buy several products.
    function buyCart(uint256[] DINs, uint256[] quantities, uint256[] subtotalValues) public {
        for (uint256 i = 0; i < DINs.length; i++) {
            uint256 orderID = buy(DINs[i], quantities[i], subtotalValues[i]);
        }
    }

    function buyWithPromoCode(
        uint256 DIN,
        uint256 quantity,
        uint256 totalValue,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) 
        public
        returns (uint256 orderID)
    {
		// TODO:
    }

    // Convenience method for buying a single DIN. Return the DIN instead of the order ID.
    function buyDIN() public returns (uint256 DIN) {
    	 uint256 orderID = buy(GENESIS_DIN, 1, 0);
         uint256 registeredDIN = uint256(orderStore.metadata(orderID));
         LogBuyDIN(registeredDIN);
    	 return registeredDIN;
    }

    /**
    * @dev Finalize the buy request.
    * @param DIN The Decentralized Identification Number (DIN) of the product to buy.
    * @param quantity The quantity to buy.
    * @param totalValue The total price of the product(s) in Kiosk Market Token (KMT) base units (i.e. "wei").
    * @param market The market for the given DIN.
    * @param approved True if this contract has validated an off-chain price change.
    * @return The order ID generated from the OrderStore.
    */
    function executeOrder(
        uint256 DIN, 
        uint256 quantity, 
        uint256 totalValue,
        address buyer, 
        Market market,
        bool approved
    ) 
        private
        returns (uint256 order)
    {
        // Add the order to the order tracker and get the order ID.
        uint256 orderID = orderMaker.addOrder(
            buyer,
            registry.owner(DIN), // Seller
            market,
            DIN,
            market.metadata(DIN),
            totalValue,
            quantity,
            block.timestamp
        );

        // Tell the market to execute the order.
        market.buy(
            DIN, 
            quantity, 
            totalValue,
            buyer, 
            approved
        );

        // Throw if the market doesn't fill the order immediately.
        // Kiosk only supports synchronous transactions at the moment.
        require (market.isFulfilled(orderID) == true);

        // Transfer the value of the order from the buyer to the market.
        if (totalValue > 0) {
            KMT.transferFromBuy(buyer, market, totalValue);
        }

        // Mark the order fulfilled.
        orderMaker.setStatus(orderID, OrderUtils.Status.Fulfilled);

        // Return the order ID.
        return orderID;
    }

    /**
    /* @dev Verifies that an order signature is valid.
    /* @param signer address of signer.
    /* @param hash Signed Keccak-256 hash.
    /* @param v ECDSA signature parameter v.
    /* @param r ECDSA signature parameters r.
    /* @param s ECDSA signature parameters s.
    /* @return Validity of order signature.
    */
    function isValidSignature(
        address signer,
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        public
        constant
        returns (bool)
    {
        return signer == ecrecover(
            keccak256("\x19Ethereum Signed Message:\n32", hash),
            v,
            r,
            s
        );
    }

    /**
    *  ==============================
    *	         Kiosk Client
    *  ==============================
    */

    // To get the name of the product or market, you have to go to the market directly.
    // This is a Solidity limitation with strings.

    function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
        Market market = getMarket(DIN);
        return market.totalPrice(DIN, quantity, buyer);
    }

    // Returns true if a given quantity of a product is available for purchase.
    function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
        Market market = getMarket(DIN);
        return market.availableForSale(DIN, quantity, buyer);
    }

    // A hash representation of a product's metadata that is added to the order.
    function metadata(uint256 DIN) constant returns (bytes32) {
        Market market = getMarket(DIN);
        return market.metadata(DIN);
    }

    // Convenience
    function getMarket(uint256 DIN) private returns (Market) {
        address marketAddr = registry.market(DIN);
        return Market(marketAddr);
    }

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
    function updateKiosk() {
        // Update Kiosk Market Token
        address kmtAddr = kiosk.KMT();
        KMT = KioskMarketToken(kmtAddr);

        // Update DINRegistry
        address registryAddr = kiosk.registry();
        registry = DINRegistry(registryAddr);

        // Update OrderMaker
        address orderMakerAddr = kiosk.orderMaker();
        orderMaker = OrderMaker(orderMakerAddr);

        // Update OrderStore
        address orderStoreAddr = kiosk.orderStore();
        orderStore = OrderStore(orderStoreAddr);
    }

}