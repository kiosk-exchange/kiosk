pragma solidity ^0.4.11;

/**
*  This is a contract used in the Kiosk Resolver to keep track of orders.
*/
contract KioskOrderTracker {

  struct Order {
    address customer;       // The address of the customer who made the purchase
    address merchant;       // The address of the merchant who owns the product
    uint256 productID;      // The DIN of the ordered product
    OrderStatus status;     // The current status of the order
  }

  enum OrderStatus {
    PendingShippingInfo,    // 0. Customer made an order, but has not provided shipping information.
    PendingReview,          // 1. Customer provided shipping information. Awaiting merchant review.
    Canceled,               // 2. Customer canceled the order.
    Accepted,               // 3. Merchant accepted the order. Customer can no longer cancel.
    Rejected,               // 4. Merchant rejected the order.
    Shipped,                // 5. Merchant shipped the order.
    Delivered               // 6. Product was delivered to the customer.
  }

  // Customer => Order ID
  mapping (address => uint256[]) customerOrderIDs;

  // Merchant => Order ID
  mapping (address => uint256[]) merchantOrderIDs;

  // OrderID => Order
  mapping (uint256 => Order) orders;

  uint public index = 0;

  function addOrder(address customer, address merchant, uint256 productID) {
      index++;
      customerOrderIDs[customer].push(productID);
      merchantOrderIDs[merchant].push(productID);
      orders[index] = Order(customer, merchant, productID, OrderStatus.PendingShippingInfo);
  }

  // /**
  // *   Get customer order IDs.
  // *   @param customer The address of the customer.
  // *   @param page The page of results. (e.g., 0 will give the first 10 results).
  // */
  // function getCustomerOrders(address customer, uint256 page) constant returns (uint8[10]) {
  //     return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // }

  // /**
  // *   Get customer orders IDs based on order status.
  // *   @param customer The address of the customer.
  // *   @param page The page of results. (e.g., 0 will give the first 10 results).
  // */
  // function getCustomerOrders(address customer, uint256 page, uint256 status) constant returns (uint8[10]) {
  //     return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // }

  // /**
  // *   Get merchant order IDs.
  // *   @param merchant The address of the merchant.
  // *   @param page The page of results. (e.g., 0 will give the first 10 results).
  // */
  // function getMerchantOrders(address merchant, uint256 page) constant returns (uint8[10]) {
  //     return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // }

  // /**
  // *   Get merchant order IDs.
  // *   @param merchant The address of the merchant.
  // *   @param page The page of results. (e.g., 0 will give the first 10 results).
  // */
  // function getMerchantOrders(address merchant, uint256 page, uint256 status) constant returns (uint8[10]) {
  //     return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // }

}