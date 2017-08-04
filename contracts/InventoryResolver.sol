pragma solidity ^0.4.11;

/**
*  This is the interface for an inventory resolver.
*/
contract InventoryResolver {
	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
}