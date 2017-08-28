pragma solidity ^0.4.11;

import "../KioskMarketToken.sol";
import "../Product.sol";
import "./ENSMarket.sol";
import "./ENS/ENS.sol";

/**
*  This is an example of how to sell an ENS domain.
*/
contract ENSProduct is Product {
	// The ENS contract.
	ENS public ens;

	struct Domain {
		bytes32 node;
		uint256 price;
	}

	// DIN => ENS Domain
	mapping (uint256 => Domain) domains;

	// ENS node => Seller
	mapping (bytes32 => address) sellers;

	// Constructor
	function ENSProduct(
		KioskMarketToken _KMT, 
		address _market,
		ENS _ens
	) Product(_KMT, _market) {
		ens = _ens;
	}

	// You need to approve this contract to spend enough KMT to purchase a DIN before calling this.
	// AFTER you call this method, transfer ownership of the domain to this contract.
	function addENSDomain(string name, bytes32 node, uint256 price) returns (uint256) {
		// Make sure this contract doesn't already own the domain.
		// This protects sellers against someone stealing their product.
		require(ens.owner(node) != address(this));

		// Make sure another seller has not tried to misrepresent that they own this domain already.
		require(sellers[node] == 0x0);

		// Buy a new DIN with KMT that the seller transferred to this contract.
		uint256 DIN = registerDIN();

		// Store the details of the ENS domain.
		domains[DIN].node = node;
		domains[DIN].price = price;

		// Add the domain to ENS Market.
		ENSMarket ensMarket = ENSMarket(market);
		ensMarket.addDomain(DIN, name, node);

		// Transfer ownership of the DIN to the seller.
		registry.setOwner(DIN, msg.sender);

		// Return the registered DIN.
		return DIN;
	}

	function productTotalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		// Each DIN represents a single domain.
		require (quantity == 1);

		return domains[DIN].price;
	}

	function setPrice(uint256 DIN, uint256 price) only_owner(DIN) {
		domains[DIN].price = price;
	}

	function productAvailableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		return domains[DIN].price > 0;
	}

	function fulfill(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) only_market {
		// Each DIN represents a single domain.
		require(quantity == 1);

		// Give ownership of the node to the buyer.
		ens.setOwner(domains[DIN].node, buyer);
	}

}
