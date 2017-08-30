pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./Market.sol";
import "./DINRegistry.sol";
import "./OrderStore.sol";
import "./Buyer.sol";

contract ProductInterface {
	function productTotalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
	function productAvailableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool);
	function fulfill(uint256 orderID, uint256 DIN, uint256 quantity, address buyer);
}

/**
*  This is a base implementation of a Product that can be used on a ProductMarket.
*/
contract Product is ProductInterface {
	// The Kiosk Market Token contract.
	KioskMarketToken public KMT;

	// The address of the Market contract.
	address public market;

	// The DINRegistry contract.
	DINRegistry public registry;

	// The OrderStore contract.
	OrderStore public orderStore;

	// The Buyer contract.
	Buyer public buyer;

	// Only the owner of a DIN (the seller) can modify product details.
	modifier only_owner(uint256 DIN) {
		require (registry.owner(DIN) == msg.sender);
		_;
	}

	// Only the market can call request fulfill.
	modifier only_market {
		require (market == msg.sender);
		_;
	}

	// Allows for multiple inheritance for contracts that act as both Market and Product
	function Product(KioskMarketToken _KMT, address _market) {
		KMT = _KMT;
		market = _market;
		updateKiosk();
	}

	// Buy a DIN. Sometimes it is necessary for a product to be able to do this.
	function registerDIN() constant returns (uint256) {
		// Register a new DIN.
		uint256 genesis = registry.genesis();

		// Get the price of a new DIN.
		uint256 price = buyer.totalPrice(genesis, 1, this);

		// Take enough KMT from the buyer to purchase a new DIN.
		if (price > 0) {
			KMT.transferFrom(msg.sender, this, price);
		}

		// Buy one DIN.
		uint256 orderID = buyer.buy(genesis, 1, price);
		
		// Convert the order metadata to the registered DIN.
		return uint256(orderStore.metadata(orderID));
	}

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
	function updateKiosk() {
		address registryAddr = KMT.registry();
		registry = DINRegistry(registryAddr);

		address orderStoreAddr = KMT.orderStore();
		orderStore = OrderStore(orderStoreAddr);

		address buyerAddr = KMT.buyer();
		buyer = Buyer(buyerAddr);
	}

}