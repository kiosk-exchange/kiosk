pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./OrderTracker.sol";
import "./Market.sol";
import "./OrderUtils.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";
// https://github.com/ConsenSys/Tokens/blob/master/contracts/HumanStandardToken.sol

contract KioskMarketToken is StandardToken {
	string public name = "Kiosk Market Token";      // Set the name for display purposes
	string public symbol = "KMT";                   // Set the symbol for display purposes
	uint256 public decimals = 18;                   // Amount of decimals for display purposes
	address public owner;

	// The address of DIN registry where all DINs are stored.
	DINRegistry public dinRegistry;

	// The address of the order tracker where all new order events are stored.
	OrderTracker public orderTracker;

	modifier only_owner {
		require (owner == msg.sender);
		_;
	}

	function KioskMarketToken(uint256 _totalSupply) {
		owner = msg.sender;
		balances[msg.sender] = _totalSupply * 10**decimals;   // Give the creator all initial tokens
		totalSupply = _totalSupply * 10**decimals;            // Update total supply
	}

	/**
	* Buy a product.
	* @param DIN The DIN of the product to buy.
	* @param quantity The quantity to buy.
	* @param value The total price of the product(s).
	*/   
	function buy(uint256 DIN, uint256 quantity, uint256 value) returns (bool) {
		// Get the address of the market.
		Market market = dinRegistry.market(DIN);

		// The buyer must have enough tokens for the purchase.
		require (balances[msg.sender] >= value);

		// The requested quantity must be available for sale.
		require(market.availableForSale(DIN, quantity) == true);

		// The value must match the market price. 
		require(market.price(DIN, quantity, msg.sender) == value);

		// Get the address of the seller.
		address seller = dinRegistry.owner(DIN);

		// Add the order to the order tracker and get the order ID.
		uint256 orderID = orderTracker.registerNewOrder(
			msg.sender,
			seller,
			market,
			DIN,
			value,
			quantity,
			block.timestamp
		);

		// Tell the market to execute the order.
		market.buy(orderID);

		// Throw an error if the order is not fulfilled by the market.
		if (market.isFulfilled(orderID) == true) {
			// Transfer the value of the order to the market.
			balances[msg.sender] = balances[msg.sender].sub(value);
			balances[market] = balances[market].add(value);
			Transfer(msg.sender, market, value);

			// Mark the order fulfilled.
			orderTracker.setStatus(orderID, OrderUtils.Status.Fulfilled);

			// Return true for transaction success.
			return true;
		}

		// Mark the order canceled. This can be used by future buyers to evaluate market trustworthiness.
		orderTracker.setStatus(orderID, OrderUtils.Status.Canceled);

		// Return false for transaction failure.
		return false;
	}

	function setOwner(address _owner) only_owner {
		owner = _owner;
	}

	function setDINRegistry(DINRegistry _dinRegistry) only_owner {
		dinRegistry = _dinRegistry;
	}

	function setOrderTracker(OrderTracker _orderTracker) only_owner {
		orderTracker = _orderTracker;
	}

}