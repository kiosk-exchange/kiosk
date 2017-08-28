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
	}

	function buy(uint256 orderID) returns (bool) {
		address buyer = orderStore.buyer(orderID);

		// Expect the next DIN on the registrar to be registered.
		expected[buyer] = registrar.index() + 1;

		super.buy(orderID);
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		address buyer = orderStore.buyer(orderID);
		uint256 expectedDIN = expected[buyer];

		return (registry.owner(expectedDIN) == buyer);
	}

	function metadata(uint256 DIN) constant returns (bytes32) {
		require(DIN == genesisDIN);

		uint256 nextDIN = registrar.index() + 1;
		return bytes32(nextDIN);
	}

	function nameOf(uint256 DIN) constant returns (string) {
		return "Decentralized Identification Number (DIN)";
	}

}
