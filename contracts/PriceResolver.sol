pragma solidity ^0.4.11;

/**
*  This is an example of a price resolver contract.
*/
contract PriceResolver {
	uint public initialized = 0;
	function price(uint256 productID, address buyer) constant returns (uint256 price);
}

contract DemoPriceResolver is PriceResolver {

	uint public initialized = 0;

	function price(uint256 productID, address buyer) constant returns (uint256 price) {
		return 0.25 ether;
	}

	function PriceResolver() {
		initialized = 1;
	}

}