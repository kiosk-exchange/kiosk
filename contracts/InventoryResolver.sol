pragma solidity ^0.4.11;

/**
*  This is an example of an inventory resolver contract.
*/
contract InventoryResolver {
	uint public initialized = 0;
	function inStock(uint256 productID) returns (bool);
}

contract DemoInventoryResolver is InventoryResolver {

	uint public initialized = 0;

	function inStock(uint256 productID) returns (bool) {
		return true;
	}

	function InventoryResolver() {
		initialized = 1;
	}

}