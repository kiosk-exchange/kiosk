pragma solidity ^0.4.11;

/**
*  This is the interface for a product (beta).
*/
contract Product {
	function supportsInterface(bytes4 interfaceID) returns (bool);
	function buy(uint256 productID, uint256 quantity) payable;
}