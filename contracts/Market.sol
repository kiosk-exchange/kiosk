pragma solidity ^0.4.11;

/**
*  This is the interface for a market (beta).
*/
contract Market {
	// function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
	// function unitPrice(uint256 DIN) constant returns (uint256);
	// function totalPrice(uint256 DIN, uint256 quantity) constant returns (uint256);
	function inStock(uint256 DIN, uint256 quantity) constant returns (bool);
	function price(uint256 DIN) constant returns (uint256);
	function buy(uint256 DIN, uint256 quantity) payable;
}

