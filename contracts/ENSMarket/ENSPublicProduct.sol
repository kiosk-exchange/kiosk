import '../Product.sol';
import '../DINRegistry.sol';
import '../DINRegistrar.sol';
import './ENSMarket.sol';
import './ENS/ENS.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of how to sell an ENS domain.
*/
contract ENSPublicProduct is Product {

	DINRegistrar public registrar;
	ENSMarket public ensMarket;
	ENS public ens;

	struct ENSNode {
		string name;
		bytes32 node;
		uint256 price;
		bool isValid;
	}

	// DIN => ENS node
	mapping(uint256 => ENSNode) public nodes;

	// Constructor
	function ENSPublicProduct(
		DINRegistry _registry,
		DINRegistrar _registrar, 
		ENSMarket _market,
		ENS _ens
	)
		Product(
			_market,
			_registry
		)
	{
		ensMarket = _market;
		registrar = _registrar;
		ens = _ens;
	}

	function addENSDomain(string name, bytes32 node, uint256 price) {
		require(price > 0);

		// Register a new DIN for the ENS node.
		uint256 DIN = registrar.registerNewDIN();

		// Store the details of the ENS node.
		nodes[DIN].name = name;
		nodes[DIN].node = node;
		nodes[DIN].price = price;
		nodes[DIN].isValid = true;

		// Add the ENS node to the ENS market.
		ensMarket.setName(DIN, name);
		ensMarket.setNode(DIN, node);
		ensMarket.addProduct(DIN, this, this, this);

		registry.setMarket(DIN, ensMarket);
		
		// Transfer ownership of the DIN so that the seller can withdraw proceeds.
		registry.setOwner(DIN, msg.sender);
	}

	function name(uint256 DIN) constant returns (string) {
		return nodes[DIN].name;
	}

	function setName(uint256 DIN, string name) only_owner(DIN) {
		nodes[DIN].name = name;
	}

	function node(uint256 DIN) constant returns (bytes32) {
		return nodes[DIN].node;
	}

	function setNode(uint256 DIN, bytes32 node) only_owner(DIN) {
		nodes[DIN].node = node;
	}

	// Quantity is irrelevant here. We're only ever selling one ENS domain at a time
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		return nodes[DIN].price;
	}

	function setPrice(uint256 DIN, uint256 price) only_owner(DIN) {
		nodes[DIN].price = price;
	}

	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		return nodes[DIN].isValid;
	}

	function handleOrder(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) only_market {
		// Check that correct proceeds from the order are ready for withdrawal.
		require(market.availableForWithdrawal(orderID) == nodes[DIN].price);
		require(market.DINForOrder(orderID) == DIN);

		// Give ownership of the node to the buyer.
		// Make sure to set the owner of the node to this contract first.
		ens.setOwner(nodes[DIN].node, buyer);
	}

}