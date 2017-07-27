import './PriceResolver.sol';

pragma solidity ^0.4.11;

/**
*  This is the interface for a price resolver.
*/
contract DemoPriceResolver is PriceResolver {

	function price(uint256 productID, address buyer) constant returns (uint256) {
		return 0.15 ether;
	}

}