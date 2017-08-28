pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./Buyer.sol";
import "./DINRegistry.sol";
import "./DINRegistrar.sol";
import "./OrderMaker.sol";
import "./OrderStore.sol";
import "./Market.sol";
import "./Product.sol";
import "./OrderUtils.sol";

/**
*  This is a base implementation of a Market that is used by Kiosk's market contracts (DINMarket, EtherMarket, ENSMarket, etc.).
*  Subclasses must implement name, nameOf, isFulfilled, and metadata.
*/
contract PublicMarket is Market {

    // The Kiosk Market Token contract.
    KioskMarketToken public KMT;

    // The Buyer contract from the Kiosk protocol.
    Buyer public buyer;

    // The DINRegistry contract from the Kiosk protocol.
    DINRegistry public registry;

    // The DINRegistrar contract from the Kiosk protocol.
    DINRegistrar public registrar;

    // The OrderMaker contract from the Kiosk protocl.
    OrderMaker public orderMaker;

    // The OrderStore contract from the Kiosk protocl.
    OrderStore public orderStore;

    // DIN => Product address
    mapping (uint256 => address) products;

    // Order ID => Amount paid
    mapping (uint256 => uint256) public pendingWithdrawals;

    modifier only_buyer {
        require (buyer == msg.sender);
        _;
    }

    modifier only_owner(uint256 DIN) {
        require (registry.owner(DIN) == msg.sender);
        _;
    }

    modifier only_seller(uint256 orderID) {
        require (orderStore.seller(orderID) == msg.sender);
        _;
    }

    modifier only_fulfilled(uint256 orderID) {
        require (orderStore.status(orderID) == OrderUtils.Status.Fulfilled);
        _;
    }

    // This contract does not accept Ether transfers.
    function () {
        throw;
    }

    // Constructor
    function PublicMarket(KioskMarketToken _KMT) {
        KMT = _KMT;
        updateKiosk();
    }

    // Process buy requests from Buyer.
    function buy(uint256 orderID) only_buyer returns (bool) {
        // Add proceeds to pending withdrawals.
        uint256 DIN = orderStore.DIN(orderID);
        uint256 quantity = orderStore.quantity(orderID);
        address buyer = orderStore.buyer(orderID);

        // Ask the seller to fulfill the order.
        address productAddr = products[DIN];
        Product product = Product(productAddr);
        product.fulfill(orderID, DIN, quantity, buyer);

        // Throw an error if the order is not fulfilled.
        require (isFulfilled(orderID) == true);

        // Add the proceeds to the seller's balance.
        pendingWithdrawals[orderID] += orderStore.value(orderID);

        return true;
    }

    // Let the seller withdraw proceeds from a sale.
    function withdraw(uint256 orderID) only_seller(orderID) only_fulfilled(orderID) {
        uint256 amount = pendingWithdrawals[orderID];

        // Zero the pending refund before to prevent re-entrancy attacks.
        pendingWithdrawals[orderID] = 0;

        // Transfer the earned amount of Kiosk Market Token to the seller.
        KMT.transfer(msg.sender, amount);
    }

    function product(uint256 DIN) constant returns (address) {
        return products[DIN];
    }

    // Get total price from the relevant Product contract.
    function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
        address productAddr = products[DIN];
        Product product = Product(productAddr); // Not trusted
        return product.productTotalPrice(DIN, quantity, buyer);
    }

    // Get availability from the relevant Product contract.
    function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
        address productAddr = products[DIN];
        Product product = Product(productAddr); // Not trusted
        return product.productAvailableForSale(DIN, quantity, buyer); // Not trusted
    }

    function setProduct(uint256 DIN, address product) only_owner(DIN) {
        products[DIN] = product;
    }

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
    function updateKiosk() {
        // Update Buyer
        address buyerAddr = KMT.buyer();
        buyer = Buyer(buyerAddr);

        // Update DINRegistry
        address registryAddr = KMT.registry();
        registry = DINRegistry(registryAddr);

        // Update DINRegistrar
        address registrarAddr = KMT.registrar();
        registrar = DINRegistrar(registrarAddr);

        // Update OrderMaker
        address orderMakerAddr = KMT.orderMaker();
        orderMaker = OrderMaker(orderMakerAddr);

        address orderStoreAddr = KMT.orderStore();
        orderStore = OrderStore(orderStoreAddr);
    }

}
