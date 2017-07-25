import './StandardToken.sol';
import './SafeMath.sol';
import './../../PriceResolver.sol';
import './../../InventoryResolver.sol';
import './../../BuyHandler.sol';
import './../../Product.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of a token that is sold as a Product.
*/
contract DemoToken is StandardToken, PriceResolver, InventoryResolver, BuyHandler {

	uint256 public DIN;
	Product public product;

	uint256 public sold = 0; // Amount of tokens already sold.

	string public name = "DemoToken"; 
	string public symbol = "DEMO";
	uint public decimals = 18;
	uint public INITIAL_SUPPLY = 10000;

	modifier only_product(uint256 _DIN) {
		require (DIN == _DIN);
		require (product == msg.sender);
    _;
  }

  function DemoToken(uint256 _DIN, Product _product) {
  	DIN = _DIN;
  	product = _product;
  	totalSupply = INITIAL_SUPPLY;
  }

	// Price Resolver
	function price(uint256 productID, address buyer) only_product(productID) constant returns (uint256 totalPrice) {
		return .001 ether;
	}

	// Inventory Resolver
	function inventory(uint256 productID) only_product(productID) constant returns (uint256) {
		return totalSupply.sub(sold);
	}

	// Buy Handler
	function handleOrder(uint256 productID, uint256 quantity, address buyer) only_product(productID) {
		sold = sold.add(quantity);
		balances[buyer] = balances[buyer].add(quantity);
	}

}