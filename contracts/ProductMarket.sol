pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./Buyer.sol";
import "./DINRegistry.sol";
import "./DINRegistrar.sol";
import "./OrderMaker.sol";
import "./OrderStore.sol";
import "./Market.sol";
import "./StandardMarket.sol";
import "./Product.sol";
import "./OrderUtils.sol";

/**
*  Market that delegates price, availability, and fulfill to a separate Product class.
*  Subclasses must implement name, nameOf, isFulfilled, and metadata.
*/
contract ProductMarket is StandardMarket {
    // DIN => Product address
    mapping (uint256 => address) products;

    // Order ID => Amount paid
    mapping (uint256 => uint256) public pendingWithdrawals;

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
    function ProductMarket(KioskMarketToken _KMT) StandardMarket(_KMT) {
        KMT = _KMT;
        updateKiosk();
    }

    // Process buy requests from Buyer.
    function buy(uint256 orderID) returns (bool) {
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
        pendingWithdrawals[orderID] = orderStore.value(orderID);

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

    // Get total price from the relevant Product contract.
    function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
        address productAddr = products[DIN];

        if (productAddr == address(0)) {
            return 0;
        }

        Product product = Product(productAddr); // Not trusted
        return product.productTotalPrice(DIN, quantity, buyer);
    }

    // Get availability from the relevant Product contract.
    function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
        address productAddr = products[DIN];

        if (productAddr == address(0)) {
            return false;
        }

        Product product = Product(productAddr); // Not trusted
        return product.productAvailableForSale(DIN, quantity, buyer); // Not trusted
    }

    function product(uint256 DIN) constant returns (address) {
        return products[DIN];
    }

    function setProduct(uint256 DIN, address product) only_owner(DIN) {
        products[DIN] = product;
    }

}
