pragma solidity ^0.4.11;

/**
*  This is the interface for an inventory resolver.
*/
contract InventoryResolver {
	function inStock(uint256 DIN, uint256 quanity) returns (bool);
}