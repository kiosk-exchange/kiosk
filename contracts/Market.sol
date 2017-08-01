pragma solidity ^0.4.11;

/**
*  This is the interface for a market (beta).
*/
contract Market {
	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
	function totalPrice(uint256 DIN, uint256 quantity) constant returns (uint256);
	function buy(uint256 DIN, uint256 quantity) payable;
}

