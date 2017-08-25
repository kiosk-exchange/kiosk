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

	function orderData(uint256 _DIN, address _buyer) constant returns (bytes32) {
		return ENSNode(_DIN);
	}

	function isFulfilled(uint256 _orderID) constant returns (bool) {
		// Get the ENS node from the order
		bytes32 node = KMT.orderTracker().data(_orderID);

		// Check that buyer is the owner
		return (ens.owner(node) == KMT.orderTracker().buyer(_orderID));
	}

	function availableForSale(uint256 _DIN, uint256 _quantity) constant returns (bool) {
		// The owner of the node must be able to transfer it during a purchase.
		if (ens.owner(ENSNode(_DIN)) != buyHandler(_DIN)) {
			return false;
		}

		return PublicMarket.availableForSale(_DIN, _quantity);
	}

	function name(uint256 _DIN) constant returns (string) {
		return domains[_DIN].name;
	}

	function setName(uint256 _DIN, string _name) only_trusted(_DIN) {
		domains[_DIN].name = _name;
	}

	function ENSNode(uint256 _DIN) constant returns (bytes32) {
		return domains[_DIN].node;
	}

	function setENSNode(uint256 _DIN, bytes32 _node) only_trusted(_DIN) {
		domains[_DIN].node = _node;
	}

}