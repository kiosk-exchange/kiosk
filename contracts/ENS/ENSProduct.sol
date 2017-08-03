import '../Product.sol';
import '../DINRegistrar.sol';
import '../PublicMarket.sol';
import './ENSMarket.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of how to sell an ENS domain.
*/
contract ENSProduct is Product {

	struct ENSDomain {
		uint256 price;
		bytes32 node;
	}

	ENSDomain public domain;

	function ENSProduct(DINRegistrar _registrar, ENSMarket _market) {
		owner = msg.sender;
		registrar = _registrar;
		market = _market;
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
		return quantity == 1;
	}

	function handleOrder(uint256 DIN, uint256 quantity, address buyer) {
		// Do nothing
	}

}