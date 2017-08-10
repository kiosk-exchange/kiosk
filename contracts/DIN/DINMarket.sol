import '../PublicMarket.sol';
import '../DINRegistry.sol';
import '../OrderTracker.sol';
import '../Product.sol';

pragma solidity ^0.4.11;

contract DINMarket is PublicMarket, Product {

	function DINMarket(DINRegistry _dinRegistry, OrderTracker _orderTracker)
		PublicMarket(_dinRegistry, _orderTracker) {}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		return true;
	}

	// Info Resolver
	function productInfo(uint256 DIN) constant returns (bytes32) {
		uint256 nextDIN = dinRegistry.index() + 1;
		return bytes32(nextDIN);
	}

	// Price Resolver
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		return 0;
	}

	// Inventory Resolver
	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		return true;
	}

	// Buy Handler
	function handleOrder(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) {
		dinRegistry.registerDINsForOwner(quantity, buyer);
	}

}