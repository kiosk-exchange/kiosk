import './DINRegistry.sol';

pragma solidity ^0.4.11;

contract OrderTracker {

	// The address of DIN registry where all DINs are stored.
  DINRegistry public dinRegistry;

  // The current order ID.
	uint256 public orderIndex = 0;

	event NewOrder(
		uint256 orderID, 
		address indexed buyer, 
		address indexed seller, 
		address market,
		uint256 indexed DIN,
		uint256 value, 
		uint256 timestamp
	);

	// Only allow updates from registered markets.
	modifier only_market(uint256 DIN) {
		require (dinRegistry.market(DIN) == msg.sender);
    _;
	}

	function OrderTracker(DINRegistry _dinRegistry) {
		dinRegistry = _dinRegistry;
	}

	function registerNewOrder(
		address buyer, 
		address seller, 
		uint256 DIN,
		uint256 value, 
		uint256 timestamp
	)
		only_market(DIN)
		returns (uint256)
	{
		// Increment the order index for a new order.
		orderIndex++;

		// Record a new order event.
		NewOrder(
			orderIndex,
			buyer,
			seller,
			msg.sender,
			DIN,
			value,
			timestamp
		);

		// Return the order ID to the market.
		return orderIndex;
	}

}