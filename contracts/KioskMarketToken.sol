pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract KioskMarketToken is StandardToken {
    string public name = "Kiosk Market Token";      // Set the name for display purposes
    string public symbol = "KMT";                   // Set the symbol for display purposes
    uint256 public decimals = 18;                   // Amount of decimals for display purposes
	
    // Constructor
    function KioskMarketToken(uint256 _totalSupply) {
        balances[msg.sender] = _totalSupply;        // Give the creator all initial tokens
        totalSupply = _totalSupply;                 // Update total supply
    }

    /**
    *  ==============================
    *         ERC20 Overrides
    *  ==============================
    */
	
    function transfer(address _to, uint256 _value) returns (bool) {
        // Do not allow transfers to this contract or the null address.
        require(_to != address(this) && _to != address(0));
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
        // Do not allow transfers to this contract or the null address.
        require(_to != address(this) && _to != address(0));

        // Allow Buy contract to have full discretion over a user's balance.
        if (msg.sender == buy) {
            balances[_to] = balances[_to].add(_value);
            balances[_from] = balances[_from].sub(_value);
            Transfer(_from, _to, _value);
            return true;
        }

        return super.transferFrom(_from, _to, _value);
    }

}