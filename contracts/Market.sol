pragma solidity ^0.4.11;

/**
*  This is the interface for a Market.
*/
contract Market {
	// The name of the market.
	string public name;

	// Buy a product. Returns true if the transaction was successful.
	function buy(uint256 DIN, uint256 quantity, uint256 value, address buyer, bool approved) returns (bool);

	// Returns true if the seller has fulfilled the order.
	function isFulfilled(uint256 orderID) constant returns (bool);

	// The name of a product.
	function nameOf(uint256 DIN) constant returns (string);

	// A hash representation of a product's metadata that is added to the order.
	function metadata(uint256 DIN) constant returns (bytes32);

	// The total price of a product for a given quantity and buyer.
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);

	// Returns true if a given quantity of a product is available for purchase.
	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool);
}