import '../Product.sol';
import '../DINRegistry.sol';
import '../DINRegistrar.sol';
import './ENSMarket.sol';
import './ENS/ENS.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of how to sell an ENS domain.
*/
contract ENSProduct is Product {

	// Allow this contract to manage DINs.
	DINRegistry public registry;
	DINRegistrar public registrar;
	ENSMarket public ensMarket;

	ENS public ens;
	uint256 public DIN;
	bool public added;

	struct ENSNode {
		string name;
		bytes32 node;
		uint256 price;
	}

	ENSNode public ensNode;

	function ENSProduct(
		DINRegistry _registry,
		DINRegistrar _registrar, 
		ENSMarket _market,
		ENS _ens,
		uint256 price,
		bytes32 node
	)
		// Initialize superclass.
		Product(
			_market
		)
	{
		ensMarket = _market;
		registry = _registry;
		registrar = _registrar;
		ens = _ens;
		addENS(price, node);
	}

	function addENS(uint256 price, bytes32 node) private {
		// Store the details of the ENS node.
		ensNode.price = price;
		ensNode.node = node;

		// Register a new DIN for the ENS node.
		DIN = registrar.registerNewDIN();

		// Add the ENS node to the ENS market.
		ensMarket.setENSNode(DIN, node);
		ensMarket.addProduct(DIN, this, this, this);

		// Transfer ownership of the DIN so that the seller can withdraw proceeds.
		registry.setMarket(DIN, ensMarket);
		registry.setOwner(DIN, owner);
	}

	function name(uint256 DIN) constant returns (string) {
		return ensNode.name;
	}

	function setName(string name) only_owner {
		ensNode.name = name;
	}

	function node(uint256 DIN) constant returns (bytes32) {
		return ensNode.node;
	}

	function setNode(bytes32 node) only_owner {
		ensNode.node = node;
	}

	function price(uint256 DIN, address buyer) constant returns (uint256) {
		return ensNode.price;
	}

	function setPrice(uint256 price) only_owner {
		ensNode.price = price;
	}

	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		if (ensNode.price == 0) {
			return false;
		}

		return true;
	}

	function handleOrder(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) {
		// Check that correct proceeds from the order are ready for withdrawal.
		require(market.availableForWithdrawal(orderID) == ensNode.price);
		require(market.DINForOrder(orderID) == DIN);

		// Give ownership of the node to the buyer.
		// Make sure to set the owner of the node to this contract first.
		ens.setOwner(node(DIN), buyer);
	}

}