pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./OrderTracker.sol";
import "./KioskMarketToken.sol";
import "./Market.sol";
import "./Product.sol";
import "./OrderUtils.sol";

/**
*  This is a base implementation of a Market that is used by Kiosk's market contracts (DINMarket, EtherMarket, ENSMarket, etc.).
*/
contract PublicMarket is Market {

    // The address of the Kiosk Market Token contract.
    KioskMarketToken public KMT;

    // DIN => Product
    mapping (uint256 => Product) products;

    // Order ID => Amount paid
    mapping (uint256 => uint256) public pendingWithdrawals;

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

    // Process buy requests from Kiosk Market Token.
    function buy(uint256 orderID) only_token returns (bool) {
        // Add proceeds to pending withdrawals.
        OrderTracker orderTracker = KMT.orderTracker();

        uint256 DIN = orderTracker.DIN(orderID);
        uint256 quantity = orderTracker.quantity(orderID);
        address buyer = orderTracker.buyer(orderID);

        // Ask the seller to fulfill the order.
        products[DIN].fulfill(orderID);

        // Throw an error if the order is not fulfilled.
        require (isFulfilled(orderID) == true);

        // Add the proceeds to the seller's balance.
        pendingWithdrawals[orderID] += orderTracker.value(orderID);

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
        return products[DIN].productTotalPrice(DIN, quantity, buyer); // Not trusted
    }

    // Get availability from the relevant Product contract.
    function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
        return products[DIN].productAvailableForSale(DIN, quantity, buyer); // Not trusted
    }

    function setProduct(uint256 DIN, Product product) only_owner(DIN) {
        products[DIN].product = product;
    }

}
