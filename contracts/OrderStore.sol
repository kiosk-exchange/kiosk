pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./OrderUtils.sol";

contract OrderStore {
	// The Kiosk Market Token contract.
    KioskMarketToken public KMT;

	// Order ID => Order
	mapping (uint256 => Order) public orders;

	// The address of the OrderMaker contract.
	address public orderMakerAddr;

	struct Order {
		address buyer;
		address seller;
		uint256 market;
		uint256 DIN;
		bytes32 metadata;
		uint256 value;                          
		uint256 quantity;
		uint256 timestamp;
		uint status;
	}

	event NewOrder(
		uint256 orderID,
		address indexed buyer,
		address indexed seller,
		address market,
		uint256 indexed DIN,
		bytes metadata,
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	);

	event StatusChanged(uint256 indexed orderID, uint8 indexed status);

	modifier only_maker {
		require (orderMakerAddr == msg.sender);
		_;
	}

	// Constructor
	function OrderStore(KioskMarketToken _KMT) {
		KMT = _KMT;
		updateKiosk();
	}

	function addOrder(
		uint256 orderId,
		address buyer,
		address seller,
		address market,
		uint256 DIN,
		bytes metadata,
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	)
		only_maker
	{
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
		);
		orders[orderId] = order;

		// Record a new order event.
		NewOrder(
			orderId,
			buyer,
			seller,
			market,
			DIN,
			value,
			quantity,
			timestamp
		);
	}

	// Let the OrderMaker update the status of the order.
	function setStatus(uint256 orderID, uint status) only_maker {
		orders[orderID].status = status;
		StatusChanged(orderID, status);
	}

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
	function updateKiosk() {
		// Update OrderMaker
		orderMakerAddr = KMT.orderMaker();
	}

	/**
	*   =========================
	*          Order Getters         
	*   =========================
	*/

	function buyer(uint256 orderID) constant returns (address) {
		return orders[orderID].buyer;
	}

	function seller(uint256 orderID) constant returns (address) {
		return orders[orderID].seller;
	}

	function market(uint256 orderID) constant returns (address) {
		return orders[orderID].market;
	}

	function DIN(uint256 orderID) constant returns (uint256) {
		return orders[orderID].DIN;
	}

	function metadata(uint256 orderID) constant returns (bytes) {
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

	function status(uint256 orderID) constant returns (uint) {
		return orders[orderID].status;
	}

}