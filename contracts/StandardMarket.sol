pragma solidity ^0.4.11;

import "./Market.sol";

/**
*  This is the interface for a market.
*/
contract StandardMarket is Market {
	// The title of the market (e.g., "Token Market").
	string public title;

	// A snapshot of data that can be used to validate order fulfillment.
	function orderData(uint256 DIN, address buyer) constant returns (bytes32);

	// The name of a product.
	function name(uint256 DIN) constant returns (string);

	// The seller can withdraw proceeds from escrow when the order has been fulfilled.
	function withdraw(uint256 orderID);
}

