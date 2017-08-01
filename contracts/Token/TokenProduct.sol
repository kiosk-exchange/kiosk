import './ERC20.sol';
import './SafeMath.sol';

pragma solidity ^0.4.11;

contract TokenProduct {
	using SafeMath for uint256;

	// How do I keep track of order book?

	ERC20 public token;

	// Seller => (Order Quantity => Price Per Token)
	mapping (address => mapping (uint256 => uint256)) orderBook;

	event Deposit(address seller, uint256 amount, uint256 price);
	event Withdraw(address seller, uint256 amount);

	function TokenProduct(ERC20 _token) {
		token = _token;
	}

	function depositTokens(uint256 amount, uint256 price) {
		// Depositor must call token.approve(this, amount) before depositing. Otherwise, the transfer will fail.
		// require (token.transferFrom(msg.sender, this, amount) == true);
		// tokens[msg.sender] = tokens[msg.sender].add(amount);
	}

	function withdrawTokens(uint256 amount) {
		// require (tokens[msg.sender] > amount);
		// tokens[msg.sender] = tokens[msg.sender].sub(amount);
		// require (token.transfer(msg.sender, amount) == true);
	}

	// Inventory Resolver
	function inStock(uint256 DIN, uint256 quantity) constant returns (bool) {
		return true;
	}

	// Buy Handler
	function handleOrder(uint256 DIN, uint256 quantity, address buyer) {
		require (token.transfer(msg.sender, quantity) == true);
	}

	
}