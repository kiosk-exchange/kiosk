pragma solidity ^0.4.11;

import "../KioskMarketToken.sol";
import "../Product.sol";
import "../Buyer.sol";
import "../Market.sol";
import "../ENSMarket.sol";
import "./ENS/ENS.sol";

/**
*  This is an example of how to sell an ENS domain.
*/
contract ENSProduct is Product {
	ENS public ens;

	struct ENSNode {
		string name;
		bytes32 node;
		uint256 price;
	}

	// DIN => ENS node
	mapping(uint256 => ENSNode) public nodes;

	// Constructor
	function ENSProduct(
		KioskMarketToken _KMT, 
		address _market,
		ENS _ens, 
	) Product(_KMT, _market) {
		ens = _ens;
	}

	// Before calling this method, you need to approve this contract to spend enough of your KMT to purchase a DIN.
	function addENSDomain(string name, bytes32 node) {
		// Register a new DIN.
		uint256 genesis = registry.genesis();
		address buyerAddr = registry.buyer();
		Buyer buyer = Buyer(buyerAddr);

		// Get the price of a new DIN.
		uint256 price = buyer.totalPrice(genesis, 1, address(this));

		// Take enough KMT from the buyer to purchase a new DIN.
		KMT.transferFrom(msg.sender, address(this), price);

		// Buy one DIN.
		buyer.buy(genesis, 1, price);

		// Store the details of the ENS domain.
		nodes[DIN].name = name;
		nodes[DIN].node = node;
		nodes[DIN].price = price;

		// Add the domain to ENS Market.
		ENSMarket ensMarket = ENSMarket(market);
		ensMarket.addDomain(DIN, name, node);

		// Transfer ownership of the DIN to the seller.
		registry.setOwner(DIN, msg.sender);
	}

	function name(uint256 DIN) constant returns (string) {
		require (nodes[DIN].price != 0);

		return nodes[DIN].name;
	}

	function setName(uint256 DIN, string name) only_owner(DIN) {
		nodes[DIN].name = name;
	}

	function node(uint256 DIN) constant returns (bytes32) {
		require (nodes[DIN].price != 0);

		return nodes[DIN].node;
	}

	function setNode(uint256 DIN, bytes32 node) only_owner(DIN) {
		nodes[DIN].node = node;
	}

	// Quantity is irrelevant here. We're only ever selling one ENS domain at a time
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		require (nodes[DIN].price != 0);

		return nodes[DIN].price;
	}

	function setPrice(uint256 DIN, uint256 price) only_owner(DIN) {
		nodes[DIN].price = price;
	}

	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		return nodes[DIN].price > 0;
	}

	function fulfill(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) only_market {
		// The buyer is only getting a single domain.
		require(quantity == 1);

		// Give ownership of the node to the buyer.
		// Make sure to set the owner of the node to this contract first.
		ens.setOwner(nodes[DIN].node, buyer);
	}

}
