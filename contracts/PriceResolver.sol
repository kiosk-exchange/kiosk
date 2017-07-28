pragma solidity ^0.4.11;

/**
*  This is the interface for a price resolver.
*/
contract PriceResolver {
	function price(uint256 DIN, address buyer) constant returns (uint256);
}