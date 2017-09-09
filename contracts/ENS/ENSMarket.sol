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
	}

	// DIN => ENS node
	mapping(uint256 => Domain) public domains;

	// Buyer => ENS node
	mapping(address => bytes32) public expected;

	// Seller => Aggregate value of sales (in KMT)
	mapping(address => uint256) public pendingWithdrawals;

	// Constructor
	function ENSMarket(KioskMarketToken _KMT, AbstractENS _ens) StandardMarket(_KMT) {
		ens = _ens;
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		address buyer = orderStore.buyer(orderID);
		bytes32 node = expected[buyer];

		// Check that buyer is the owner of the domain.
		return (ens.owner(node) == buyer);
	}

	function buy(
		uint256 DIN, 
		uint256 quantity, 
		uint256 value, 
		address buyer
	) 	
		only_buyer 
		returns (bool) 
	{
		// Expect the buyer to own the domain at the end of the transaction.
		expected[buyer] = domains[DIN].node;

		// Each DIN represents a single domain.
		require(quantity == 1);

		// Give ownership of the node to the buyer.
		ens.setOwner(domains[DIN].node, buyer);

		// Update pending withdrawals for the seller.
		address seller = domains[DIN].seller;
		pendingWithdrawals[seller] += value;

		// Remove domain from storage.
		delete domains[DIN];
	}

	function withdraw() {
		uint256 amount = pendingWithdrawals[msg.sender];
		pendingWithdrawals[msg.sender] = 0;

		KMT.transfer(msg.sender, amount);
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

		return domains[DIN].price;
	}

	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		// The owner of the domain must be able to transfer it during a purchase.
		// This means the market must hold the domain for the transaction to succeed.
		// bytes32 node = domains[DIN].node;

		// // Verify that ENSMarket is the owner of the domain.
		// if (ens.owner(node) != address(this)) {
		// 	return false;
		// }
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

	function pendingWihdrawal(address seller) constant returns (uint256) {
		return pendingWithdrawals[seller];
	}

}