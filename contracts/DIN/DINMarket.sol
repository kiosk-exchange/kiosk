pragma solidity ^0.4.11;

import "../PublicMarket.sol";
import "../DINRegistry.sol";
import "../OrderTracker.sol";
import "../KioskMarketToken.sol";
import "../PriceResolver.sol";
import "../InventoryResolver.sol";
import "../BuyHandler.sol";

contract DINMarket is PublicMarket, PriceResolver, InventoryResolver, BuyHandler {

	string public title = "DIN Market";

	function DINMarket(
		DINRegistry _dinRegistry, 
		OrderTracker _orderTracker,
		KioskMarketToken _token 
	)
		PublicMarket(_dinRegistry, _orderTracker, _token) 
	{
		uint256 genesis = _dinRegistry.genesis();
		products[genesis].priceResolver = this;
		products[genesis].inventoryResolver = this;
		products[genesis].buyHandler = this;
	}

	function orderInfo(uint256 DIN, address buyer) constant returns (bytes32) {
		uint256 nextDIN = dinRegistry.index() + 1;
		return bytes32(nextDIN);
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		uint256 firstDIN = uint256(orderTracker.data(orderID));
		uint256 quantity = orderTracker.quantity(orderID);

		// If only one DIN was registered, check that it is owned by the buyer.
		if (quantity == 1) {
			return (dinRegistry.owner(firstDIN) == orderTracker.buyer(orderID));
		}

		uint256 lastDIN = firstDIN + quantity - 1;

		// If more than one DIN was registered, check that the first and last DIN are owned by the buyer.
		return (
			(dinRegistry.owner(firstDIN) == orderTracker.buyer(orderID)) &&
			(dinRegistry.owner(lastDIN) == orderTracker.buyer(orderID))
		);
	}

	function name(uint256 DIN) constant returns (string) {
		return "Decentralized Identification Number (DIN)";
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
