pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";

contract Kiosk {
    /**
    *  ==============================
    *      Kiosk Protocol Contracts
	*  ==============================
    */

    // The address of the Kiosk Market Token contract.
    address public KMT;

    // Owner will be a DAO that manages Kiosk protocol contract upgrades based on KMT ownership.
    address public owner;

    // The address of the Buy contract.
    address public buy;

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
	function Kiosk(KioskMarketToken _KMT) {
		KMT = _KMT;
		owner = msg.sender;
	}

    /**
    *  ==============================
    *              Upgrade
    *  ==============================
    */

    function setKMT(address _KMT) only_owner {
    	KMT = _KMT;
    }

    function setOwner(address _owner) only_owner {
        owner = _owner;
    }

    function setBuy(address _buy) only_owner {
        buy = _buy;
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