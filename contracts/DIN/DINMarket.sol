pragma solidity ^0.4.11;

import "../KioskMarketToken.sol";
import "../PublicMarket.sol";

contract DINMarket is PublicMarket {

	string public name = "DIN Market";

	// Buyer => Expected DIN to be registered.
	mapping (address => uint256) public expected;

	function DINMarket(KioskMarketToken _KMT, address _DINProduct) PublicMarket(_KMT) {
		uint256 genesis = registry.genesis();

		// The DIN product is represented by the genesis identifier.
		products[genesis] = _DINProduct;
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
		uint256 nextDIN = registrar.index() + 1;
		return bytes32(nextDIN);
	}

	function nameOf(uint256 DIN) constant returns (string) {
		return "Decentralized Identification Number (DIN)";
	}

}
