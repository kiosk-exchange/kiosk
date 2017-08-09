pragma solidity ^0.4.11;

/**
*  This is the interface for a market.
*/
contract Market {
	function buy(uint256 DIN, uint256 quantity) payable returns (uint256);
	function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
	function price(uint256 DIN, uint256 quantity) constant returns (uint256);
	function isFulfilled(uint256 orderID) constant returns (bool);
	function withdraw(uint256 orderID);
}

