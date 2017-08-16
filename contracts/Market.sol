pragma solidity ^0.4.11;

/**
*  This is the interface for a Market.
*/
contract Market {
	// Returns true if the seller has fulfilled the order.
	function isFulfilled(uint256 orderID) constant returns (bool);

	// Buy a product. Returns true if the transaction was successful.
	function buy(uint256 orderID) returns (bool);

	// The total price of a product for a given quantity and buyer.
	function price(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);

	// Returns true if a given quantity of a product is available for purchase.
	function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
}