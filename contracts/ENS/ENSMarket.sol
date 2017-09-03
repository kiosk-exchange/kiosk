pragma solidity ^0.4.11;

import "./ENS/AbstractENS.sol";
import "../StandardMarket.sol";
import "../KioskMarketToken.sol";

contract ENSMarket is StandardMarket {

	string public name = "ENS Market";

	// ENS Registry
	AbstractENS public ens;

	struct Domain {
		address seller;
		string name;
		bytes32 node;
		uint256 price;
		bool available;
		mapping (address => uint256) prices;			// Set a price for specific buyer(s) (optional)
		mapping (address => bool) availabilities;		// Set availability for specific buyer(s) (optional)
	}

	// DIN => ENS node
	mapping(uint256 => Domain) public domains;

	// Buyer => Node of purchased domain
	mapping(address => bytes32) public expected;

	// Constructor
	function ENSMarket(KioskMarketToken _KMT, AbstractENS _ens) StandardMarket(_KMT) {
		ens = _ens;
	}

	function buy(uint256 DIN, uint256 quantity, address buyer) only_buyer returns (bool) {
		// Expect the buyer to own the domain at the end of the transaction.
		expected[buyer] = domains[DIN].node;

		// Each DIN represents a single domain.
		require(quantity == 1);

		// Give ownership of the node to the buyer.
		ens.setOwner(domains[DIN].node, buyer);

		// Remove domain from storage.
		delete domains[DIN];
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		return true;
		// address buyer = orderStore.buyer(orderID);
		// bytes32 node = expected[buyer];

		// Check that buyer is the owner of the domain.
		// return (ens.owner(node) == buyer);
	}

	function nameOf(uint256 DIN) constant returns (string) {
		return domains[DIN].name;
	}

	function metadata(uint256 DIN) constant returns (bytes32) {
		return domains[DIN].node;
	}

	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		require (quantity == 1);
		require (domains[DIN].available == true);
		// See if a specific price has been set for the buyer.
		if (domains[DIN].prices[buyer] > 0) {
			return domains[DIN].prices[buyer];
		}
		return domains[DIN].price;
	}

	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		// The owner of the domain must be able to transfer it during a purchase.
		// This means the market must hold the domain for the transaction to succeed.
		bytes32 node = getNode(DIN);

		// Verify that ENSMarket is the owner of the domain.
		if (ens.owner(node) != address(this)) {
			return false;
		}

		// See if the domain is specifically available for the buyer.
		if (domains[DIN].availabilities[buyer] == true) {
			return true;
		}

		return domains[DIN].available;
	}

	function setDomain(
		uint256 DIN,
		string name,
		bytes32 node,
		uint256 price,
		bool available
	) 
		only_owner(DIN) 
	{
		// TODO: Add validation that the node matches the namehash of the name.
		// TODO: Add validation that the node is not already "claimed" by another seller.
		domains[DIN].seller = msg.sender;
		domains[DIN].name = name;
		domains[DIN].node = node;
		domains[DIN].price = price;
		domains[DIN].available = available;
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

	function setPrice(uint256 DIN, uint256 price) only_owner(DIN) {
		domains[DIN].price = price;
	}

	function setAvailable(uint256 DIN, bool available) only_owner(DIN) {
		domains[DIN].available = available;
	}

	// TODO: Set price for buyer
	// TODO: Set available for buyer
	// TODO: Set expiration

}