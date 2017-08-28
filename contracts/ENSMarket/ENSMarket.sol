pragma solidity ^0.4.11;

import "./ENS/AbstractENS.sol";
import "../PublicMarket.sol";
import "../OrderTracker.sol";
import "../KioskMarketToken.sol";

contract ENSMarket is PublicMarket {

	string public title = "ENS Market";

	// ENS Registry
	AbstractENS public ens;

	struct ENSDomain {
		string name;
		bytes32 node;
	}

	// DIN => ENS node
	mapping(uint256 => ENSDomain) public domains;

	// Constructor
	function ENSMarket(KioskMarketToken _KMT, AbstractENS _ens) PublicMarket(_KMT) {
		ens = _ens;
	}

	function orderData(uint256 DIN, address buyer) constant returns (bytes32) {
		return ENSNode(DIN);
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		// Get the ENS node from the order
		bytes32 node = KMT.orderTracker().data(orderID);

		// Check that buyer is the owner
		return (ens.owner(node) == KMT.orderTracker().buyer(orderID));
	}

	function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		// The owner of the node must be able to transfer it during a purchase.
		if (ens.owner(ENSNode(DIN)) != buyHandler(DIN)) {
			return false;
		}

		return PublicMarket.availableForSale(DIN, quantity);
	}

	function name(uint256 DIN) constant returns (string) {
		return domains[DIN].name;
	}

	function setName(uint256 DIN, string name) only_trusted(DIN) {
		domains[DIN].name = name;
	}

	function ENSNode(uint256 DIN) constant returns (bytes32) {
		return domains[DIN].node;
	}

	function setENSNode(uint256 DIN, bytes32 node) only_trusted(DIN) {
		domains[DIN].node = node;
	}

}