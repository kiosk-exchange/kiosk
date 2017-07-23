pragma solidity ^0.4.11;

/**
*  This is an example of an inventory resolver contract.
*/
contract InventoryResolver {

	function inStock(uint256 productID) returns (bool) {
		return true;
	}

}