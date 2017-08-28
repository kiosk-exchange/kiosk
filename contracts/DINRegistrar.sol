pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./DINRegistry.sol";

/**
*  This contract manages new DIN registrations. It is invoked by DINMarket and changes DINRegistry.
*/
contract DINRegistrar {
    // The Kiosk Market Token contract.
    KioskMarketToken public KMT;

    // The DIN Registry contract
    DINRegistry registry;

    // The current DIN index.
    uint256 public index;

    // The address of DINMarket, where DINs can be purchased.
    address public marketAddr;

    modifier only_market {
        require (marketAddr == msg.sender);
        _;
    }

    // Constructor
    function DINRegistrar(KioskMarketToken _KMT) {
        KMT = _KMT;
        updateKiosk();
    }

    /**
     * Register a new DIN.
     * @param owner The account that will own the DIN.
     */
    function registerDINForOwner(address owner) only_market returns (uint256) {
        index++;
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
    function registerDINsForOwner(uint256 quantity, address owner) only_market {
        for (uint i = 0; i < quantity; i++) {
            registerDINForOwner(owner);
        }
    }

    // Convenience method
    function registerDINs(uint256 quantity) only_market {
        registerDINsForOwner(quantity, msg.sender);
    }

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
    function updateKiosk() {
        // Update DINRegistry
        address registryAddr = KMT.registry();
        registry = DINRegistry(registryAddr);

        // Update DINMarket
        uint256 genesis = registry.genesis();
        marketAddr = registry.market(genesis);
    }

}