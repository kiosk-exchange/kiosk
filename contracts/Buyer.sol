pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./DINRegistry.sol";
import "./OrderMaker.sol";
import "./OrderStore.sol";
import "./Market.sol";
import "./OrderUtils.sol";

contract Buyer {
	// The Kiosk Market Token contract.
	KioskMarketToken public KMT;

	// The DIN Registry contract.
	DINRegistry public registry;

	// The Order Maker contract.
	OrderMaker public orderMaker;

	modifier only_KMT {
		require (KMT == msg.sender);
		_;
	}

	// Constructor
	function Buyer(KioskMarketToken _KMT) {
		KMT = _KMT;
		updateKiosk();
	}

	/**
	* Buy a product.
	* @param DIN The DIN of the product to buy.
	* @param quantity The quantity to buy.
	* @param totalValue The total price of the product(s).
	*/
	function buy(
		uint256 DIN, 
		uint256 quantity, 
		uint256 totalValue, 
		address buyer
	) 
		public
		only_KMT 
		returns (uint256) 
	{
		// Get the Market.
		address marketAddr = registry.market(DIN);
		Market market = Market(marketAddr);

		// The buyer must have enough tokens for the purchase.
		require (KMT.balanceOf(buyer) >= totalValue);

		// The requested quantity must be available for sale.
		require(market.availableForSale(DIN, quantity, buyer) == true);

		// The value must match the market price. 
		require(market.totalPrice(DIN, quantity, buyer) == totalValue);

		// If conditions are met, call the private buyProduct method to complete the transaction.
		return buyProduct(DIN, quantity, totalValue, buyer, market);
	}

	function buyProduct(
		uint256 DIN, 
		uint256 quantity, 
		uint256 totalValue,
		address buyer, 
		Market market
	) 
		private
		returns (uint256)
	{
		// Add the order to the order tracker and get the order ID.
		uint256 orderID = orderMaker.addOrder(
			buyer,
			registry.owner(DIN), // Seller
			market,
			DIN,
			market.metadata(DIN),
			totalValue,
			quantity,
			block.timestamp
		);

		// Tell the market to execute the order.
		market.buy(DIN, quantity, buyer);

		// Throw if the market does not fulfill the order.
		// Right now, Buyer only supports transactions that can be settled immediately (i.e., instant delivery).
		require(market.isFulfilled(orderID) == true);
			
		// Transfer the value of the order from the buyer to the market.
		if (totalValue > 0) {
			KMT.transferFrom(buyer, market, totalValue);
		}

		// Mark the order fulfilled.
		orderMaker.setStatus(orderID, OrderUtils.Status.Fulfilled);

		// Return the order ID.
		return orderID;
	}

	/**
	*	==============================
	*	         Kiosk Client
	*	==============================
	*/

	// To get the name of the product, you have to go to the market directly.
	// This is a Solidity limitation with strings.

	// A hash representation of a product's metadata that is added to the order.
	function metadata(uint256 DIN) constant returns (bytes32) {
		Market market = getMarket(DIN);
		return market.metadata(DIN);
	}

	// The total price of a product for a given quantity and buyer.
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		Market market = getMarket(DIN);
		return market.totalPrice(DIN, quantity, buyer);
	}

	// Returns true if a given quantity of a product is available for purchase.
	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		Market market = getMarket(DIN);
		return market.availableForSale(DIN, quantity, buyer);
	}

	// Convenience
	function getMarket(uint256 DIN) private returns (Market) {
		address marketAddr = registry.market(DIN);
		return Market(marketAddr);
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