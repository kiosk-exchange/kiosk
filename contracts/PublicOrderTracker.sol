pragma solidity ^0.4.11;

/**
*  This contract keeps track of orders from the public kiosk. NOT DONE.
*/
contract PublicOrderTracker {

	struct Order {
    uint256 productID;      // The DIN of the ordered product
    address customerID;     // The address of the customer who made the purchase
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

  function addOrder(address customer, address merchant, uint256 productID) {
  	// TODO: Do some magic
  }

  /**
  *   Get customer order IDs.
  *   @param customer The address of the customer.
  *   @param page The page of results. (e.g., 0 will give the first 10 results).
  */
  function getCustomerOrders(address customer, uint256 page) constant returns (uint256[10]) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  /**
  *   Get customer orders IDs based on order status.
  *   @param customer The address of the customer.
  *   @param page The page of results. (e.g., 0 will give the first 10 results).
  */
  function getCustomerOrders(address customer, uint256 page, uint256 status) constant returns (uint256[10]) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  /**
  *   Get merchant order IDs.
  *   @param customer The address of the customer.
  *   @param page The page of results. (e.g., 0 will give the first 10 results).
  */
  function getMerchantOrders(address merchant, uint256 page) constant returns (uint256[10]) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  /**
  *   Get merchant order IDs.
  *   @param customer The address of the customer.
  *   @param page The page of results. (e.g., 0 will give the first 10 results).
  */
  function getMerchantOrders(address merchant, uint256 page, uint256 status) constant returns (uint256[10]) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

}