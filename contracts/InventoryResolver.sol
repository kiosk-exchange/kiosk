pragma solidity ^0.4.11;

/**
*  This is the interface for an inventory resolver.
*/
contract InventoryResolver {
	function inventory(uint256 productID) returns (uint256);
}