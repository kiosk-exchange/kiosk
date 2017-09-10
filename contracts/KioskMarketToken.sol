pragma solidity ^0.4.11;

import "./Kiosk.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract KioskMarketToken is StandardToken {
    string public name = "Kiosk Market Token";      // Set the name for display purposes
    string public symbol = "KMT";                   // Set the symbol for display purposes
    uint256 public decimals = 18;                   // Amount of decimals for display purposes
    Kiosk public kiosk;                             // The address of the Kiosk protocol contract
	
    // Constructor
    function KioskMarketToken(Kiosk _kiosk, uint256 _totalSupply) {
    	kiosk = _kiosk;
        balances[msg.sender] = _totalSupply;        // Give the creator all initial tokens
        totalSupply = _totalSupply;                 // Update total supply
    }

    /**
    *  ==============================
    *          ERC20 Extension
    *  ==============================
    */
    function transferFromBuy(address _from, address _to, uint256 _value) returns (bool) {
        require (kiosk.isValid(msg.sender) == true);

        // Allow Buy contract to have full discretion over a user's balance.
        balances[_to] = balances[_to].add(_value);
        balances[_from] = balances[_from].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }

}