pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./OrderStore.sol";

contract OrderMaker {
	// The Kiosk Market Token contract.
	KioskMarketToken public KMT;

	// The address of the Buyer contract.
	address public buyerAddr;

	// The OrderStore contract.
	OrderStore public orderStore;

	// The current order ID.
	uint256 public orderIndex = 0;

	modifier only_buyer {
		require (buyerAddr == msg.sender);
		_;
	}

	// Constructor
	function OrderMaker(KioskMarketToken _KMT) {
		KMT = _KMT;
		updateKiosk();
	}

	function addOrder(
		address buyer,
		address seller,
		address market,
		uint256 DIN,
		bytes metadata,
		uint256 value,
		uint256 quantity,
		uint256 timestamp
	)
		only_buyer
		returns (uint256) // Return the newly generated order ID.
	{
		// Increment the order index for a new order.
		orderIndex++;

		OrderStore.addOrder(
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
	function setStatus(uint256 orderID, uint8 status) only_buyer {
		OrderStore.setStatus(orderID, status);
	}

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
	function updateKiosk() {
		// Update Buyer
		buyerAddr = KMT.buyer();

		// Update OrderStore
		address orderStoreAddr = KMT.orderStore();
		orderStore = OrderStore(orderStoreAddr);
	}

}
