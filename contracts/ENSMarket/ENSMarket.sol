import './ENS/AbstractENS.sol';
import '../PublicMarket.sol';
import '../DINRegistry.sol';
import '../Market.sol';

pragma solidity ^0.4.11;

contract ENSMarket is PublicMarket {

	// ENS Registry
	AbstractENS public ens;

	struct ENSDomain {
		string name;
		bytes32 node;
	}

	// DIN => ENS node
	mapping(uint256 => ENSDomain) public domains;

	// Constructor
	function ENSMarket(DINRegistry dinRegistryAddr, AbstractENS ensAddr)
		PublicMarket(dinRegistryAddr)
	{
		ens = ensAddr;
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		// Get the ENS node from the order
		uint256 DIN = orders[orderID].DIN;
		bytes32 node = ENSNode(DIN);

		// Check that buyer is the owner
		return (ens.owner(node) == orders[orderID].buyer);
	}

	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		// The owner of the node must be able to transfer it during a purchase.
		if (ens.owner(ENSNode(DIN)) != buyHandler(DIN)) {
			return false;
		}

		return PublicMarket.isAvailableForSale(DIN, quantity);
	}

	function name(uint256 DIN) constant returns (string) {
		return domains[DIN].name;
	}

	function setName(uint256 DIN, string name) only_owner(DIN) {
		domains[DIN].name = name;
	}

	function ENSNode(uint256 DIN) constant returns (bytes32) {
		return domains[DIN].node;
	}

	function setNode(uint256 DIN, bytes32 node) only_owner(DIN) {
		domains[DIN].node = node;
	}

}