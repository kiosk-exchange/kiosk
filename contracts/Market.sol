pragma solidity ^0.4.11;

/**
*  This is the interface for a market (beta).
*/
contract Market {
	function supportsInterface(bytes4 interfaceID) constant returns (bool);
	function inStock(uint256 productID, uint256 quantity) constant returns (bool);
	function price(uint256 productID) constant returns (uint256);
	function buy(uint256 productID, uint256 quantity) payable;
}