pragma solidity ^0.4.11;

/**
*  This is the interface for a price resolver.
*/
contract PriceResolver {
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
}