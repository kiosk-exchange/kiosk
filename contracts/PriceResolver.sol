pragma solidity ^0.4.11;

/**
*  This is an example of a price resolver contract.
*/
contract PriceResolver {

	function price(uint256 productID, address buyer) constant returns (uint256 price) {
		return 0.25 ether;
	}

}