import '../PriceResolver.sol';
import '../InventoryResolver.sol';
import '../BuyHandler.sol';
import '../Market.sol';
import './StandardToken.sol';
import './SafeMath.sol';

pragma solidity ^0.4.11;

contract TokenProduct is PriceResolver, InventoryResolver, BuyHandler {	
	// using SafeMath for uint256;

	// StandardToken public token;
	// Market public market;

	// struct Ask {
	// 	uint256 quantity;
	// 	uint256 price;
	// }

	// mapping (address => uint256) public balances;

	// event Deposit(address seller, uint256 amount, uint256 price);
	// event Withdraw(address seller, uint256 amount);

	// function TokenProduct(StandardToken _token) {
	// 	token = _token;
	// }

	// function depositTokens(uint256 quantity, uint256 price) {
	// 	// Depositor must call token.approve(this, amount) before depositing. Otherwise, the transfer will fail.
	// 	require (token.transferFrom(msg.sender, this, amount) == true);
	// 	tokens[msg.sender] = tokens[msg.sender].add(amount);
	// }

	// function withdrawTokens(uint256 quantity) {
	// 	// require (tokens[msg.sender] > amount);
	// 	// tokens[msg.sender] = tokens[msg.sender].sub(amount);
	// 	// require (token.transfer(msg.sender, amount) == true);
	// }

	// function withdraw() {

	// }

	// // Price Resolver
	// function price(uint256 DIN) constant returns (uint256) {

	// }

	// // Inventory Resolver
	// function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
	// 	return true;
	// }

	// // Buy Handler
	// function handleOrder(uint256 DIN, uint256 quantity, address buyer) {
	// 	require (token.transfer(msg.sender, quantity) == true);
	// }

	
}