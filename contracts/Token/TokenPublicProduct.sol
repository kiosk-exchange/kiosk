pragma solidity ^0.4.11;

import "../Product.sol";
import "../DINRegistry.sol";
import "../Market.sol";
import "./TokenMarket.sol";
import "zeppelin-solidity/contracts/token/ERC20.sol";

contract TokenPublicProduct is Product {

	TokenMarket public tokenMarket;
	ERC20 public token;

	struct Ask {
		uint256 totalPrice;
		uint256 quantity;
		address seller;
		bool isValid;
	}

	// DIN => Ask
	mapping(uint256 => Ask) public asks;

	// Constructor
	// Initialize the public product contract with a specific token market.
	function TokenPublicProduct(
		DINRegistry _registry,
		TokenMarket _market
	)
		Product(
			_market,
			_registry
		)
	{
		tokenMarket = _market;
		token = _market.token();
	}

	function addToken(
		uint256 DIN,
		uint256 quantity, 
		uint256 totalPrice
	) only_owner(DIN) {
		// Store the details of the ask
		asks[DIN].quantity = quantity;
		asks[DIN].totalPrice = totalPrice;
		asks[DIN].seller = msg.sender;
		asks[DIN].isValid = true;
		tokenMarket.setQuantity(DIN, quantity);
	}

	// Price Resolver
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		// Let the buyer buy back his tokens (remove them from the market) for free.
		// if (buyer == registry.owner(DIN)) {
		// 	return 0;
		// }
		// TODO: There is probably a precision issue here.
		return asks[DIN].totalPrice * quantity / asks[DIN].quantity;
	}

	// Inventory Resolver
	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		// Make sure the number of tokens requested is less than or equal to the number of tokens for sale.
		bool inventory = quantity <= asks[DIN].quantity;
		
		address seller = asks[DIN].seller;

		// Make sure this contract is allowed to transfer the required token quantity on behalf of the seller.
		bool allowance = token.allowance(seller, this) >= quantity;

		return (asks[DIN].isValid && inventory && allowance);
	} 

	// Buy Handler
	function handleOrder(
		uint256 orderID, 
		uint256 DIN, 
		uint256 quantity, 
		address buyer
	) 
		only_market 
	{
		require (asks[DIN].quantity > quantity);
		// Transfer the token to the buyer
		token.transferFrom(asks[DIN].seller, buyer, quantity);
	}

}