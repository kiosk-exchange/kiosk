import '../Market.sol';
import '../Product.sol';

pragma solidity ^0.4.11;

contract DINMarket is PublicMarket, Product {

	uint256 public index;

	function DINMarket(DINRegistry _dinRegistry, OrderTracker _orderTracker) 
		PublicMarket(_dinRegistry, _orderTracker)
	{
		index = _dinRegistry.genesis();
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		return (dinRegistry.owner(index) == msg.sender);
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
		index++;
		dinRegistry.registerDIN(index, buyer);
	}

}