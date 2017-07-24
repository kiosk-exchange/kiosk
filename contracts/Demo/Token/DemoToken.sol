pragma solidity ^0.4.11;

import './HumanStandardToken.sol';
import './../../PriceResolver.sol';
import './../../InventoryResolver.sol';
import './../../BuyHandler.sol';
import './../../Product.sol';

/**
*  This is an example of a token that can be distributed as a Product
*/
contract DemoToken is HumanStandardToken, PriceResolver, InventoryResolver, BuyHandler {

	uint256 DIN;
	Product product; // TODO: Determine from DIN.

	uint256 public allocated; // Amount of tokens purchased.

	modifier only_product() {
    if (product != msg.sender) throw;
    _;
  }

	function DemoToken(uint256 _DIN, Product _product) {
		DIN = _DIN;
		product = _product;
	}

	// Price Resolver
	function price(uint256 productID, address buyer) constant returns (uint256 totalPrice) {
		if (productID != DIN) throw;

		return 0.001 ether;
	}

	// Inventory Resolver
	function inventory(uint256 productID) constant returns (uint256) {
		if (productID != DIN) throw;

		return totalSupply - allocated;
	}

	// Buy Handler
	function handleOrder(uint256 productID, uint256 quantity, address buyer) only_product() {
		if (productID != DIN) throw;

		allocated += quantity;
		balances[buyer] += quantity;
	}

}