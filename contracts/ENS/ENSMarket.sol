import './AbstractENS.sol';
import '../PublicMarket.sol';
import '../DINRegistry.sol';

pragma solidity ^0.4.11;

contract ENSMarket is PublicMarket {

	DINRegistry public dinRegistry;
	AbstractENS public ens;

	function ENSMarket(DINRegistry dinRegistryAddr, AbstractENS ensAddr) {
		dinRegistry = dinRegistryAddr;
		ens = ensAddr;
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		// Get the ENS node from the order
		// bytes32 node = ENSNode(orders[orderID].DIN);

		// Check that buyer is the owner
		// return (ens.owner(node) == orders[orderID].buyer);
		return false;
	}

	function ENSNode(uint256 DIN) constant returns (bytes32) {
		return 0;
	}

	// function setENSNode(uint256 DIN, bytes32 node) only_owner(DIN) {
	// }

}