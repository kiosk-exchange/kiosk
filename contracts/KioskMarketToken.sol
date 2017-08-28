pragma solidity ^0.4.11;

import "./Market.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract KioskMarketToken is StandardToken {

	string public name = "Kiosk Market Token";      // Set the name for display purposes
	string public symbol = "KMT";                   // Set the symbol for display purposes
	uint256 public decimals = 18;                   // Amount of decimals for display purposes
	
	// Owner is a DAO that manages Kiosk protocol contract upgrades.
	address public owner;

	/**
	*	==============================
	*	   Kiosk Protocol Contracts
	*	==============================
	*/

	// The address of the DINRegistry contract.
	address public registry;							

	// The address of DINRegistrar contract.
	address public registrar;

	// The address of the OrderStore contract.
	address public orderStore;

	// The address of the OrderMaker contract.
	address public orderMaker;

	// The address of the Buyer contract.
	address public buyer;

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
		balances[msg.sender] = _totalSupply;   // Give the creator all initial tokens
		totalSupply = _totalSupply;            // Update total supply
	}

	function setOwner(address _owner) only_owner {
		owner = _owner;
	}

	function setRegistry(address _registry) only_owner {
		registry = _registry;
	}

	function setRegistrar(address _registrar) only_owner {
		registrar = _registrar;
	}

	function setOrderStore(address _orderStore) only_owner {
		orderStore = _orderStore;
	}

	function setOrderMaker(address _orderMaker) only_owner {
		orderMaker = _orderMaker
	}

	function setBuyer(address _buyer) only_owner {
		buyer = _buyer;
	}

	/**
	*	==============================
	*	       ERC20 Overrides
	*	==============================
	*/
	
	function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
		// The Buyer contract has full discretion to spend a user's balance.
		if (spender == buyer) {
			return totalSupply;
		}
		return super.allowance(owner, spender);
	}

	function transfer(address _to, uint256 _value) returns (bool) {
		// Do not allow transfers to this contract or the null address.
		require(_to != this && _to != 0x0);
		return super.transfer(_to, _value);
	}

	function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
		// Do not allow transfers to this contract or the null address.
		require(_to != this && _to != 0x0);
		return super.transferFrom(_from, _to, _value);
	}

}