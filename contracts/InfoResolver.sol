pragma solidity ^0.4.11;

/**
*  This is the interface for an info resolver.
*/
contract InfoResolver {
	function productInfo(uint256 DIN) constant returns (bytes32);
}