pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./KioskMarketToken.sol";
import "./OrderUtils.sol";

contract OrderTracker {
	// The address of the DIN Registry contract.
	DINRegistry public registry;

	// The address of the Kiosk Market Token contract.
	KioskMarketToken public KMT;

	// The current order ID.
	uint256 public orderIndex = 0;

	// Order ID => Order
	mapping (uint256 => Order) public orders;

	struct Order {
		address buyer;
		address seller;
		uint256 market;
		uint256 DIN;
		bytes32 metadata;
		uint256 value;                          
		uint256 quantity;
		uint256 timestamp;
		OrderUtils.Status status;
	}

	event NewOrder(
		uint256 orderID,
		address indexed buyer,
		address indexed seller,
		address market,
		uint256 indexed DIN,
		bytes32 metadata,
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	);

	modifier only_market(uint256 DIN) {
		require (registry.market(DIN) == msg.sender);
		_;
	}

	modifier only_token {
		require (KMT == msg.sender);
		_;
	}

	// Constructor
	function OrderTracker(DINRegistry _registry, KioskMarketToken _token) {
		registry = _registry;
		KMT = _token;
	}

	function registerNewOrder(
		address buyer,
		address seller,
		address market,
		uint256 DIN,
		bytes32 metadata,
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	)
		only_token // Only Kiosk Market token is allowed to register new orders.
		returns (uint256) // Return the newly generated order ID.
	{
		// Increment the order index for a new order.
		orderIndex++;

		// Add the order details to internal storage.
		Order order = Order(
			buyer, 
			seller, 
			market,
			DIN,
			metadata,
			value,
			quantity,
			timestamp,
			OrderUtils.Status.Pending
		)
		orders[orderIndex] = order;

		// Record a new order event.
		NewOrder(
			orderIndex,
			buyer,
			seller,
			market,
			DIN,
			value,
			quantity,
			timestamp
		);

		// Return the order ID to the token.
		return orderIndex;
	}

	// Let the token update the status of the order to Fulfilled or Canceled.
	function setStatus(uint256 orderID, OrderUtils.Status status) only_token {
		orders[orderID].status = status;
	}

	/**
	*   =========================
	*            Getters         
	*   =========================
	*/

	function buyer(uint256 orderID) constant returns (address) {
		return orders[orderID].buyer;
	}

	function seller(uint256 orderID) constant returns (address) {
		return orders[orderID].seller;
	}

	function DIN(uint256 orderID) constant returns (uint256) {
		return orders[orderID].DIN;
	}

	function metadata(uint256 orderID) constant returns (bytes32) {
		return orders[orderID].metadata;
	}

	function value(uint256 orderID) constant returns (uint256) {
		return orders[orderID].value;
	}

	function quantity(uint256 orderID) constant returns (uint256) {
		return orders[orderID].quantity;
	}

	function timestamp(uint256 orderID) constant returns (uint256) {
		return orders[orderID].timestamp;
	}

	function status(uint256 orderID) constant returns (OrderUtils.Status) {
		return orders[orderID].status;
	}

	function data(uint256 orderID) constant returns (bytes32) {
		return orders[orderID].data;
	}

}
