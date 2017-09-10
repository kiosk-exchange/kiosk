pragma solidity ^0.4.11;

import "./Kiosk.sol";
import "./OrderStore.sol";
import "./OrderUtils.sol";

contract OrderMaker {
	// The Kiosk contract.
	Kiosk public kiosk;

	// The OrderStore contract.
	OrderStore public orderStore;

	// The current order ID.
	uint256 public orderIndex = 0;

	modifier only_buy {
		require (kiosk.isValid(msg.sender) == true);
		_;
	}

	// Constructor
	function OrderMaker(Kiosk _kiosk) {
		kiosk = _kiosk;
		updateKiosk();
	}

	function addOrder(
		address buyer,
		address seller,
		address market,
		uint256 DIN,
		bytes32 metadata,
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	)
		only_buy
		returns (uint256) // Return the newly generated order ID.
	{
		// Increment the order index for a new order.
		orderIndex++;

		orderStore.addOrder(
			orderIndex,
			buyer,
			seller,
			market,
			DIN,
			metadata,
			value,
			quantity,
			timestamp
		);

		// Return the order ID to the token.
		return orderIndex;
	}

	// Let the OrderMaker update the status of the order.
	function setStatus(uint256 orderID, OrderUtils.Status status) only_buy {
		orderStore.setStatus(orderID, status);
	}

    // Update Kiosk protocol contracts if they change on Kiosk
	function updateKiosk() {
		// Update OrderStore
		address orderStoreAddr = kiosk.orderStore();
		orderStore = OrderStore(orderStoreAddr);
	}

}
