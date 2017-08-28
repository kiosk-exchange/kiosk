pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./OrderTracker.sol";
import "./Buy.sol";
import "./Market.sol";
import "./OrderUtils.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract KioskMarketToken is StandardToken {

	string public name = "Kiosk Market Token";      // Set the name for display purposes
	string public symbol = "KMT";                   // Set the symbol for display purposes
	uint256 public decimals = 18;                   // Amount of decimals for display purposes
	
	// The owner has the power to upgrade DINRegistry, OrderTracker, and Buy contracts.
	// Owner will eventually contain a decentralized voting mechanism to approve upgrades.
	address public owner;							

	// The address of DIN registry where all DINs are stored.
	DINRegistry public registry;

	// The address of the order tracker where all new order events are stored.
	OrderTracker public orderTracker;

	// The address of the contract containing buy business logic.
	Buy public buy;

	modifier only_owner {
		require (owner == msg.sender);
		_;
	}

	modifier only_buyer {
		require (owner == msg.sender);
		_;
	}

	function KioskMarketToken(uint256 _totalSupply) {
		owner = msg.sender;
		balances[msg.sender] = _totalSupply * 10**decimals;   // Give the creator all initial tokens
		totalSupply = _totalSupply * 10**decimals;            // Update total supply
	}

	function setOwner(address _owner) only_owner {
		owner = _owner;
	}

	function setDINRegistry(DINRegistry _registry) only_owner {
		registry = _registry;
	}

	function setOrderTracker(OrderTracker _orderTracker) only_owner {
		orderTracker = _orderTracker;
	}

	function setBuy(Buy _buy) only_owner {
		buy = _buy;
	}

	function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
		// if ()
		return super.allowance(owner, spender);
	}

}