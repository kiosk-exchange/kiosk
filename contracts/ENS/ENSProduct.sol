import '../Product.sol';
import '../DINRegistrar.sol';
import '../PublicMarket.sol';
import './ENSMarket.sol';
import './ENS.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of how to sell an ENS domain.
*/
contract ENSProduct is Product {

	ENS public ens;

	struct ENSDomain {
		uint256 price;
		bytes32 node;
	}

	ENSDomain public domain;

	function ENSProduct(
		DINRegistrar _registrar, 
		ENSMarket _market,
		ENS _ens
	)
		// Initialize superclass
		Product(
			_registrar,
			_market
		)
	{
		// Set ENS Registry
		ens = _ens;
	}

	function addENS(uint256 price, bytes32 node) {
		domain.price = price;
		domain.node = node;

		uint256 DIN = registrar.registerNewDIN();
		market.addProduct(DIN, this, this, this, this);
	}

	function price(uint256 DIN, address buyer) constant returns (uint256) {
		return domain.price;
	}

	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		return true;
	}

	function handleOrder(uint256 DIN, uint256 quantity, address buyer) {
		// Make sure to set the owner of the node to this contract first.
		ens.setOwner(0, buyer);
	}

}