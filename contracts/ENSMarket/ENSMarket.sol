import './ENS/AbstractENS.sol';
import '../PublicMarket.sol';
import '../DINRegistry.sol';
import '../Market.sol';

pragma solidity ^0.4.11;

contract ENSMarket is PublicMarket {

	// ENS Registry
	AbstractENS public ens;

	// DIN => ENS node
	mapping(uint256 => bytes32) public nodes;

	// Constructor
	function ENSMarket(DINRegistry dinRegistryAddr, AbstractENS ensAddr)
		PublicMarket(dinRegistryAddr)
	{
		ens = ensAddr;
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		// Get the ENS node from the order
		bytes32 node = ENSNode(orders[orderID].DIN);

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

	function ENSNode(uint256 DIN) constant returns (bytes32) {
		return nodes[DIN];
	}

	function setENSNode(uint256 DIN, bytes32 node) only_owner(DIN) {
		nodes[DIN] = node;
	}

}