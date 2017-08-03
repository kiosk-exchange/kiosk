pragma solidity ^0.4.11;

/**
*  This is the interface for a buy handler.
*/
contract BuyHandler {
	function handleOrder(uint256 orderID, uint256 DIN, uint256 quantity, address buyer);
}