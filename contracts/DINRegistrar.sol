pragma solidity ^0.4.11;

import "./Kiosk.sol";
import "./DINRegistry.sol";
import "./Market.sol";

/**
*  This contract manages new DIN registrations. It is invoked by DINMarket and changes DINRegistry.
*/
contract DINRegistrar {
    // The Kiosk contract.
    Kiosk public kiosk;

    // The DIN Registry contract
    DINRegistry registry;

    // The current DIN index.
    uint256 public index;

    // The address of DINMarket.
    address public marketAddr;

    modifier only_market {
        require (marketAddr == msg.sender);
        _;
    }

    // Constructor
    function DINRegistrar(Kiosk _kiosk) {
        kiosk = _kiosk;

        address registryAddr = kiosk.registry();
        registry = DINRegistry(registryAddr);
        index = registry.genesis();
    }

    /**
     * Register a new DIN.
     * @param owner The account that will own the DIN.
     */
    function registerDINForOwner(address owner) only_market returns (uint256) {
        // Increment the index
        index++;
        // Register a new DIN.
        registry.register(index, owner);
        return index;
    }

    // Convenience method
    function registerDIN() only_market {
        registerDINForOwner(msg.sender);
    }

    /**
     * Register multiple new DINs.
     * @param quantity The number of DINs to register.
     * @param owner The account that will own the registered DINs.
     */
    function registerDINsForOwner(address owner, uint256 quantity) only_market {
        for (uint i = 0; i < quantity; i++) {
            registerDINForOwner(owner);
        }
    }

    // Convenience method
    function registerDINs(uint256 quantity) only_market {
        registerDINsForOwner(msg.sender, quantity);
    }

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
    function updateKiosk() {
        // Update DINRegistry
        address registryAddr = kiosk.registry();
        registry = DINRegistry(registryAddr);

        // Update DINMarket
        uint256 genesis = registry.genesis();
        marketAddr = registry.market(genesis);
    }

}