import './StandardToken.sol';
import './SafeMath.sol';
import '../PriceResolver.sol';
import '../InventoryResolver.sol';
import '../BuyHandler.sol';
import '../Market.sol';

pragma solidity ^0.4.11;

/**
*  This is an example of a token that is sold as a Product.
*/
contract DemoToken is StandardToken, PriceResolver, InventoryResolver, BuyHandler {

	// uint256 public DIN;
	// Market public market;

	// uint256 public sold = 0; // Amount of tokens already sold.

	// string public name = "DemoToken"; 
	// string public symbol = "DEMO";
	// uint public decimals = 18;
	// uint public INITIAL_SUPPLY = 10000;

	// modifier only_product(uint256 _DIN) {
	// 	require (DIN == _DIN);
	// 	require (market == msg.sender);
 //    _;
 //  }

 //  function DemoToken(uint256 _DIN, Market _market) {
 //  	DIN = _DIN;
 //  	market = _market;
 //  	totalSupply = INITIAL_SUPPLY;
 //  }

 //  // Product Info
 //  function name(uint256 DIN) only_product(DIN) constant returns (string) {
 //  	return "DemoToken";
 //  }

	// // Price Resolver
	// function price(uint256 DIN, address buyer) only_product(DIN) constant returns (uint256) {
	// 	return .001 ether;
	// }

	// // Inventory Resolver
	// function isAvailableForSale(uint256 DIN, uint256 quantity) only_product(DIN) constant returns (bool) {
	// 	return totalSupply >= sold + quantity;
	// }

	// // Buy Handler
	// function handleOrder(uint256 DIN, uint256 quantity, address buyer) only_product(DIN) {
	// 	sold = sold.add(quantity);
	// 	balances[buyer] = balances[buyer].add(quantity);
	// }

}