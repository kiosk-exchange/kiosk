pragma solidity ^0.4.11;

/**
*  This is the interface for a market.
*/
contract Market {

	string public title;

	// Snapshot of information that is added to an order which can be used to validate order fulfillment.
	function orderInfo(uint256 DIN) constant returns (bytes32);

	// Returns true if the seller has fulfilled the order.
	function isFulfilled(uint256 orderID) constant returns (bool);

  function name(uint256 DIN) constant returns (string);

	// Buy a product. Returns an order ID from the order tracker.
	function buy(uint256 DIN, uint256 quantity) payable returns (uint256);

	// The total price of a product for a given quantity.
	function price(uint256 DIN, uint256 quantity) constant returns (uint256);

	// Returns true if a given quantity of a product can be purchased.
	function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool);

	// The seller can withdraw proceeds from escrow when the order has been fulfilled.
	function withdraw(uint256 orderID);
}

