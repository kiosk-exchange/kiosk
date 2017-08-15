// Based on https://github.com/ConsenSys/Tokens/blob/master/contracts/HumanStandardToken.sol

pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract KioskMarketToken is StandardToken {
	string public name = "Kiosk Market Token";				// Set the name for display purposes
  string public symbol = "KMT";											// Set the symbol for display purposes
  uint256 public decimals = 18;											// Amount of decimals for display purposes

  function KioskMarketToken(uint256 _totalSupply) {
    balances[msg.sender] = _totalSupply * 10**decimals;		// Give the creator all initial tokens
    totalSupply = _totalSupply * 10**decimals;            // Update total supply
	}
}