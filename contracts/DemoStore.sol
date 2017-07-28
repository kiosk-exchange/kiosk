import './PublicMarket.sol';
import './ProductInfo.sol';
import './PriceResolver.sol';
import './InventoryResolver.sol';
import './BuyHandler.sol';
import './DINRegistrar.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of how to implement a store using Kiosk.
*/
contract DemoStore is ProductInfo, PriceResolver, InventoryResolver, BuyHandler {

	struct Product {
		string name;
		uint256 price;
	}

	address public owner;

	DINRegistrar registrar;
	PublicMarket market;

	mapping (uint256 => Product) public products;

	// Example of how to have a sale on the entire store.
	uint256 public discountPercent = 0;

	modifier only_owner() {
      require (owner == msg.sender);
      _;
  }

  modifier only_market() {
  		require (market == msg.sender);
  		_;
  }

	// Constructor
	function DemoStore(DINRegistrar _registrar, PublicMarket _market) {
		owner = msg.sender;
		registrar = _registrar;
		market = _market;
	}

	function addProduct(string name, uint256 price) only_owner {
		uint256 DIN = registrar.registerNewDIN();

		products[DIN].name = name;
		products[DIN].price = price;

		market.addProduct(DIN, this, this, this, this);
	}

	function setName(uint256 DIN, string name) only_owner {
		products[DIN].name = name;
	}

	function setPrice(uint256 DIN, uint256 price) only_owner {
		products[DIN].price = price;
	}

	function setDiscountPercent(uint256 percent) only_owner {
		require (discountPercent < 100);

		discountPercent = percent;
	}

	function setOwner(address _owner) only_owner {
		owner = _owner;
	}

	function setMarket(PublicMarket _market) only_owner {
		market = _market;
	}

	// Product Info
	function name(uint256 DIN) constant returns (string) {
		return products[DIN].name;
	}

	// Price Resolver
	function price(uint256 DIN, address buyer) constant returns (uint256) {
		return products[DIN].price * (100 - discountPercent) / 100;
	}

	// Inventory Resolver
	function inStock(uint256 DIN, uint256 quantity) constant returns (bool) {
		return true;
	}

	// Buy Handler
	function handleOrder(uint256 productID, uint256 quantity, address buyer) {
		// Do nothing
	}

}