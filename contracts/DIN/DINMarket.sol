pragma solidity ^0.4.11;

import "../KioskMarketToken.sol";
import "../PublicMarket.sol";
import "./DINProduct.sol";

contract DINMarket is PublicMarket {

	string public name = "DIN Market";

	// Buyer => Expected DIN to be registered.
	mapping (address => uint256) public expected;

	uint256 public genesisDIN;

	function DINMarket(KioskMarketToken _KMT) PublicMarket(_KMT) {
		genesisDIN = registry.genesis();
		products[genesisDIN] = this;
	}

	function buy(uint256 orderID) returns (bool) {
		address buyer = orderStore.buyer(orderID);
		uint256 quantity = orderStore.quantity(orderID);

		// Expect the next DIN on the registrar to be registered.
		expected[buyer] = registrar.index() + 1;

		registrar.registerDINsForOwner(buyer, quantity);
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		address buyer = orderStore.buyer(orderID);
		uint256 expectedDIN = expected[buyer];

		return (registry.owner(expectedDIN) == buyer);
	}

	function nameOf(uint256 DIN) constant returns (string) {
		require(DIN == genesisDIN);

		return "Decentralized Identification Number (DIN)";
	}

	function metadata(uint256 DIN) constant returns (bytes32) {
		require(DIN == genesisDIN);

		uint256 nextDIN = registrar.index() + 1;
		return bytes32(nextDIN);
	}

	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		require(DIN == genesisDIN);

		return 0;
	}

	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		require(DIN == genesisDIN);

		return true;
	}


}
