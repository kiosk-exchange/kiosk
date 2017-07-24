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

	uint256 DIN;
	uint256 totalSupply;
	Product product; // TODO: Determine from DIN.

	uint256 public allocated; // Amount of tokens purchased.

	// Modifiers
	modifier only_product {
    if (product != msg.sender) throw;
    _;
  }

  modifier only_DIN(uint256 _DIN) {
  	require (DIN == _DIN);
  	_;
  }

  function DemoToken(uint256 _DIN) {
  	DIN = _DIN;
  }

	// Price Resolver
	function price(uint256 _productID, address buyer) only_DIN(_productID) constant returns (uint256 totalPrice) {
		return 0.001 ether;
	}

	// Inventory Resolver
	function inventory(uint256 _productID) only_DIN(_productID) constant returns (uint256) {
		return totalSupply - allocated;
	}

	// Buy Handler
	function handleOrder(uint256 _productID, uint256 quantity, address buyer) only_DIN(_productID) only_product {
		allocated += quantity;
		balances[buyer] += quantity;
	}

}