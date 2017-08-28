pragma solidity ^0.4.11;

contract Product {
	function fulfill(uint256 orderID);
	function productAvailableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool);
	function productTotalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
}