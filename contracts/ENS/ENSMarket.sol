pragma solidity ^0.4.11;

import "./ENS/AbstractENS.sol";
import "../PublicMarket.sol";
import "../KioskMarketToken.sol";

contract ENSMarket is PublicMarket {

	string public name = "ENS Market";

	// ENS Registry
	AbstractENS public ens;

	struct Domain {
		string name;
		bytes32 node;
	}

	// DIN => ENS node
	mapping(uint256 => Domain) public domains;

	// Buyer => Node of purchased domain
	mapping(address => bytes32) public expected;

	// Constructor
	function ENSMarket(KioskMarketToken _KMT, AbstractENS _ens) PublicMarket(_KMT) {
		ens = _ens;
	}

	function buy(uint256 orderID) returns (bool) {
		uint256 DIN = orderStore.DIN(orderID);
		address buyer = orderStore.buyer(orderID);

		// Expect the buyer to own the domain at the end of the transaction.
		expected[buyer] = getNode(DIN);

		super.buy(orderID);

		// TODO: Clear storage.
		// domains[DIN].name = "";
		// domains[DIN].node = 0x0;
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		address buyer = orderStore.buyer(orderID);
		bytes32 node = expected[buyer];

		// Check that buyer is the owner of the domain.
		return (ens.owner(node) == buyer);
	}

	function nameOf(uint256 DIN) constant returns (string) {
		return domains[DIN].name;
	}

	function metadata(uint256 DIN) constant returns (bytes32) {
		return getNode(DIN);
	}

	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		// The owner of the domain must be able to transfer it during a purchase.
		// This means the product must hold the domain for the transaction to succeed.
		bytes32 node = getNode(DIN);

		// Check that the product is the owner of the domain.
		if (ens.owner(node) != products[DIN]) {
			return false;
		}

		return super.availableForSale(DIN, quantity, buyer);
	}

	function addDomain(uint256 DIN, string name, bytes32 node) only_owner(DIN) {
		// TODO: Add validation that the node matches the namehash of the name.
		domains[DIN].name = name;
		domains[DIN].node = node;
	}

	function setName(uint256 DIN, string name) only_owner(DIN) {
		// TODO: Add validation
		domains[DIN].name = name;
	}

	function getNode(uint256 DIN) constant returns (bytes32) {
		return domains[DIN].node;
	}

	function setNode(uint256 DIN, bytes32 node) only_owner(DIN) {
		// TODO: Add validation
		domains[DIN].node = node;
	}

}