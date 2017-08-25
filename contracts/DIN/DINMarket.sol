pragma solidity ^0.4.11;

import "../PublicMarket.sol";
import "../DINRegistry.sol";
import "../OrderTracker.sol";
import "../KioskMarketToken.sol";
import "../Product.sol";

contract DINMarket is PublicMarket, Product {

	string public title = "DIN Market";

	function DINMarket(KioskMarketToken _KMT) PublicMarket(_KMT) {
		uint256 genesis = _KMT.dinRegistry().genesis();
		products[genesis].priceResolver = this;
		products[genesis].inventoryResolver = this;
		products[genesis].buyHandler = this;
	}

	function orderData(uint256 DIN, address buyer) constant returns (bytes32) {
		uint256 nextDIN = KMT.dinRegistry().index() + 1;
		return bytes32(nextDIN);
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		uint256 firstDIN = uint256(KMT.orderTracker().data(orderID));
		uint256 quantity = KMT.orderTracker().quantity(orderID);

		// If only one DIN was registered, check that it is owned by the buyer.
		if (quantity == 1) {
			return (KMT.dinRegistry().owner(firstDIN) == KMT.orderTracker().buyer(orderID));
		}

		uint256 lastDIN = firstDIN + quantity - 1;

		// If more than one DIN was registered, check that the first and last DIN are owned by the buyer.
		return (
			(KMT.dinRegistry().owner(firstDIN) == KMT.orderTracker().buyer(orderID)) &&
			(KMT.dinRegistry().owner(lastDIN) == KMT.orderTracker().buyer(orderID))
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
		KMT.dinRegistry().registerDINsForOwner(quantity, buyer);
	}

}
