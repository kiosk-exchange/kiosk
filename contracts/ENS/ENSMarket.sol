import './AbstractENS.sol';
import '../PublicMarket.sol';
import '../DINRegistry.sol';

pragma solidity ^0.4.11;

contract ENSMarket is PublicMarket {

	AbstractENS public ens;

	function ENSMarket(DINRegistry dinRegistryAddr, AbstractENS ensAddr) {
		dinRegistry = dinRegistryAddr;
		ens = ensAddr;
	}

	// function ENSMarket() {
		// dinRegistry = dinRegistryAddr;
		// ens = ensAddr;
	// }

	// function isFulfilled(uint256 orderID) constant returns (bool) {
	// 	// Get the ENS node from the order
	// 	bytes32 node = ENSNode(orders[orderID].DIN);

	// 	// Check that buyer is the owner
	// 	return (ens.owner(node) == orders[orderID].buyer);
	// }

	// function ENSNode(uint256 DIN) constant returns (bytes32) {
	// 	return 0;
	// }

	// function setENSNode(uint256 DIN, bytes32 node) only_owner(DIN) {
		// Only let the seller set the ENS node once.
		// Make sure the seller owns the ENS node.
	// }

}