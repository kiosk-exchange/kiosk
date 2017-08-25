pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./OrderTracker.sol";
import "./KioskMarketToken.sol";
import "./PriceResolver.sol";
import "./InventoryResolver.sol";
import "./BuyHandler.sol";
import "./StandardMarket.sol";
import "./OrderUtils.sol";

/**
*  This is the default Kiosk implementation of a Market contract.
*/
contract PublicMarket is StandardMarket {

    struct Product {
        PriceResolver priceResolver;            // Returns product price.
        InventoryResolver inventoryResolver;    // Returns whether product is in stock.
        BuyHandler buyHandler;                  // Returns the address of the contract that handles orders.
    }

    // The address of the Kiosk Market Token contract.
    KioskMarketToken public KMT;

    // DIN => Product
    mapping (uint256 => Product) products;

    // Order ID => Amount paid
    mapping (uint256 => uint256) public pendingWithdrawals;

    // Events
    event PriceResolverChanged(uint256 indexed DIN, address PriceResolver);
    event InventoryResolverChanged(uint256 indexed DIN, address InventoryResolver);
    event BuyHandlerChanged(uint256 indexed DIN, address BuyHandler);

    modifier only_token {
        require (KMT == msg.sender);
        _;
    }

    modifier only_owner(uint256 DIN) {
        require (KMT.dinRegistry().owner(DIN) == msg.sender);
        _;
    }

    modifier only_seller(uint256 orderID) {
        require (KMT.orderTracker().seller(orderID) == msg.sender);
        _;
    }

    // Allow the owner or the buy handler to modify product details.
    modifier only_trusted(uint256 DIN) {
        require (KMT.dinRegistry().owner(DIN) == msg.sender || buyHandler(DIN) == msg.sender);
        _;
    }

    modifier only_fulfilled(uint256 orderID) {
        require (KMT.orderTracker().status(orderID) == OrderUtils.Status.Fulfilled);
        _;
    }

    // This contract does not accept direct payments. Use the "buy" function to buy a product.
    function () {
        throw;
    }

    // Constructor
    function PublicMarket(KioskMarketToken _KMT) {
        KMT = _KMT;
    }

    /**
    *   =========================
    *            Orders         
    *   =========================
    */

    function buy(uint256 orderID) only_token returns (bool) {
        // Add proceeds to pending withdrawals.
        OrderTracker orderTracker = KMT.orderTracker();

        uint256 DIN = orderTracker.DIN(orderID);
        uint256 quantity = orderTracker.quantity(orderID);
        address buyer = orderTracker.buyer(orderID);

        bytes32 data = orderData(DIN, buyer);
        // Add data to the order.
        orderTracker.setData(orderID, data);

        // Call the product's buy handler to fulfill the order.
        products[DIN].buyHandler.handleOrder(orderID, DIN, quantity, buyer);

        // Throw an error if the order is not fulfilled. Revert changes in state to protect the seller.
        require (isFulfilled(orderID) == true);

        // Add the proceeds to the seller's balance.
        pendingWithdrawals[orderID] += orderTracker.value(orderID);

        return true;
    }

    /**
    *   Withdraw proceeds of sales.
    */
    function withdraw(uint256 orderID) only_seller(orderID) only_fulfilled(orderID) {
        uint256 amount = pendingWithdrawals[orderID];

        // Zero the pending refund before to prevent re-entrancy attacks.
        pendingWithdrawals[orderID] = 0;

        // TODO: THIS NEEDS TO TRANSFER FROM KMT.
        msg.sender.transfer(amount);
    }

    /**
    *   =========================
    *            Price          
    *   =========================
    */ 

    function price(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
        return products[DIN].priceResolver.totalPrice(DIN, quantity, buyer);
    }

    function priceResolver(uint256 DIN) constant returns (address) {
        return products[DIN].priceResolver;
    }

    function setPriceResolver(uint256 DIN, PriceResolver resolver) only_owner(DIN) {
        products[DIN].priceResolver = resolver;
        PriceResolverChanged(DIN, resolver);
    }

    /**
    *   =========================
    *          Inventory          
    *   =========================
    */ 

    function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
        return products[DIN].inventoryResolver.isAvailableForSale(DIN, quantity);
    }

    function inventoryResolver(uint256 DIN) constant returns (address) {
        return products[DIN].inventoryResolver;
    }

    function setInventoryResolver(uint256 DIN, InventoryResolver resolver) only_owner(DIN) {
        products[DIN].inventoryResolver = resolver;
        InventoryResolverChanged(DIN, resolver);
    }

    /**
    *   =========================
    *         Buy Handler          
    *   =========================
    */ 

    function buyHandler(uint256 DIN) constant returns (address) {
        return products[DIN].buyHandler;
    }

    function setBuyHandler(uint256 DIN, BuyHandler handler) only_owner(DIN) {
        products[DIN].buyHandler = handler;
        BuyHandlerChanged(DIN, handler);
    }

    // Convenience method (set all resolvers at once)
    function setProduct(uint256 DIN, PriceResolver priceResolver, InventoryResolver inventoryResolver, BuyHandler buyHandler) only_owner(DIN) {
        // Set product resolvers
        products[DIN].priceResolver = priceResolver;
        products[DIN].inventoryResolver = inventoryResolver;
        products[DIN].buyHandler = buyHandler;

        // Events
        PriceResolverChanged(DIN, priceResolver);
        InventoryResolverChanged(DIN, inventoryResolver);
        BuyHandlerChanged(DIN, buyHandler);
    }

}
