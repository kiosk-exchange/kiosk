import './StandardToken.sol';
import './../../PriceResolver.sol';
import './../../InventoryResolver.sol';
import './../../BuyHandler.sol';
import './../../Product.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of a token that can be distributed as a Product
*/
contract DemoToken is StandardToken, PriceResolver, InventoryResolver, BuyHandler {

	uint256 productID;
	uint256 totalSupply;
	Product product; // TODO: Determine from DIN.

	uint256 public allocated; // Amount of tokens purchased.

	modifier only_product() {
    if (product != msg.sender) throw;
    _;
  }

	// Price Resolver
	function price(uint256 _productID, address buyer) constant returns (uint256 totalPrice) {
		if (productID != _productID) throw;

		return 0.001 ether;
	}

	// Inventory Resolver
	function inventory(uint256 _productID) constant returns (uint256) {
		if (productID != _productID) throw;

		return totalSupply - allocated;
	}

	// // Buy Handler
	function handleOrder(uint256 _productID, uint256 quantity, address buyer) only_product() {
		if (productID != _productID) throw;

		allocated += quantity;
		balances[buyer] += quantity;
	}

}