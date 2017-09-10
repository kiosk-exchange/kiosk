pragma solidity ^0.4.11;

contract Kiosk {
    /**
    *  ==============================
    *      Kiosk Protocol Contracts
	*  ==============================
    */

    // In production, owner will be a DAO that approves contract upgrades based on KMT ownership.
    // While in beta, owner is the Kiosk developers.
    address public owner;

    // Buy contract address => Valid 
    // This allows us to add functionality while still allowing older versions of Buy to function.
    mapping (address => bool) public validBuyAddresses;

    // The address of the DINRegistry contract.
    address public registry;

    // The address of DINRegistrar contract.
    address public registrar;

    // The address of the OrderStore contract.
    address public orderStore;

    // The address of the OrderMaker contract.
    address public orderMaker;

    modifier only_owner {
        require (owner == msg.sender);
        _;
    }

    // Constructor
	function Kiosk() {
		owner = msg.sender;
	}

    // Kiosk Market Token will use this do determine whether to accept a transferFromBuy call
    function isValid(address _buy) constant returns (bool) {
    	return validBuys[_buy];
    }

    /**
    *  ==============================
    *              Upgrade
    *  ==============================
    */

    function setOwner(address _owner) only_owner {
        owner = _owner;
    }

    function setBuy(address _buy, bool _valid) only_owner {
    	validBuyAddresses[_buy] = _valid;
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
        orderMaker = _orderMaker;
    }

}