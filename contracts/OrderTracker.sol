pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./KioskMarketToken.sol";
import "./OrderUtils.sol";

contract OrderTracker {
	// The address of the DIN Registry contract.
	DINRegistry public dinRegistry;

	// The address of the Kiosk Market Token contract.
	KioskMarketToken public KMT;

	// The current order ID.
	uint256 public orderIndex = 0;

	// Order ID => Order
	mapping (uint256 => Order) public orders;

	struct Order {
		address buyer;
		address seller;
		uint256 DIN;
		bytes32 data;					// Used by Markets to confirm order fulfillment.
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
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	);

	modifier only_market(uint256 DIN) {
		require (dinRegistry.market(DIN) == msg.sender);
		_;
	}

	modifier only_token {
		require (KMT == msg.sender);
		_;
	}

	// Constructor
	function OrderTracker(DINRegistry _dinRegistry, KioskMarketToken _token) {
		dinRegistry = _dinRegistry;
		KMT = _token;
	}

	function registerNewOrder(
		address buyer,
		address seller,
		address market,
		uint256 DIN,
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
		orders[orderIndex].buyer = buyer;
		orders[orderIndex].seller = seller;
		orders[orderIndex].DIN = DIN;
		orders[orderIndex].value = value;
		orders[orderIndex].quantity = quantity;
		orders[orderIndex].timestamp = timestamp;
		orders[orderIndex].status = OrderUtils.Status.Pending;

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

	// Let the market add data to the order to later verify that a seller fulfilled the order.
	function setData(uint256 orderID, bytes32 data) only_market(orders[orderID].DIN) {
		orders[orderID].data = data;
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
