import '../ProductInfo.sol';
import '../Product.sol';
import '../DINRegistrar.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of how to implement a store using Kiosk.
*/
contract DemoStore is ProductInfo, Product {

	struct Product {
		string name;
		uint256 price;
	}

	mapping (uint256 => Product) public products;

	// Example of how to have a sale on the entire store.
	uint256 public discountPercent = 0;

	function addProduct(uint256 DIN, string name, uint256 price) only_owner {
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

	// Product Info
	function name(uint256 DIN) constant returns (string) {
		return products[DIN].name;
	}

	// Price Resolver
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		return products[DIN].price * quantity * (100 - discountPercent) / 100;
	}

	// Inventory Resolver
	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		return true;
	}

	// Buy Handler
	function handleOrder(uint256 productID, uint256 quantity, address buyer) {
		// Do nothing
	}

}