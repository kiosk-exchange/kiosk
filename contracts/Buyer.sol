pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./DINRegistry.sol";
import "./OrderMaker.sol";
import "./Market.sol";
import "./OrderUtils.sol";

contract Buyer {

	// The Kiosk Market Token contract.
	KioskMarketToken public KMT;

	// The DIN Registry contract.
	DINRegistry public registry;

	// The Order Maker contract.
	OrderMaker public orderMaker;

	function Buyer(KioskMarketToken _KMT) {
		KMT = _KMT;
		updateKiosk();
	}

	/**
	* Buy a product.
	* @param DIN The DIN of the product to buy.
	* @param quantity The quantity to buy.
	* @param value The total price of the product(s).
	*/   
	function buy(uint256 DIN, uint256 quantity, uint256 value) returns (bool) {
		// Get the address of the market.
		address marketAddr = registry.market(DIN);
		Market memory market = Market(marketAddr);

		// The buyer must have enough tokens for the purchase.
		require (KMT.balanceOf(msg.sender) >= value);

		// The requested quantity must be available for sale.
		require(market.availableForSale(DIN, quantity) == true);

		// The value must match the market price. 
		require(market.totalPrice(DIN, quantity, msg.sender) == value);

		// Get the address of the seller.
		address seller = registry.owner(DIN);

		// Add the order to the order tracker and get the order ID.
		uint256 orderID = orderTracker.addOrder(
			msg.sender,
			seller,
			market,
			DIN,
			value,
			quantity,
			block.timestamp
		);

		// Tell the market to execute the order.
		market.buy(orderID);

		// Throw if the market does not fulfill the order.
		// Right now, Buyer only supports transactions that can be settled immediately (e.g., instant delivery).
		require(market.isFulfilled(orderID) == true) {
			// Transfer the value of the order to the market.
			KMT.transferFrom(buyer, market, value);

			// Mark the order fulfilled.
			orderTracker.setStatus(orderID, OrderUtils.Status.Fulfilled);

			// Return true for transaction success.
			return true;
		}
	}

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
	function updateKiosk() {
		// Update DINRegistry
		address registryAddr = KMT.registry();
		registry = DINRegistry(registryAddr);

		// Update OrderMaker
		address orderMakerAddr = KMT.orderMaker();
		orderMaker = OrderMaker(orderMakerAddr);
	}

}