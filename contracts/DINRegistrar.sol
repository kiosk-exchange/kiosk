pragma solidity ^0.4.11;

import './DINRegistry.sol';

/**
*  This is the registrar contract for the DINRegistry. DINs are distributed sequentially for now.
*/
contract DINRegistrar {

	// The latest DIN registered. This increments before a new DIN is registered.
    uint public index;

    DINRegistry registry;

    /**
     * Constructor
     */
    function DINRegistrar(DINRegistry registry) {
        registry = registry;
    }

    // Logged when a new DIN is registered.
    event NewRegistration(uint indexed DIN, address indexed owner);

    /**
     * Registers a new DIN for the specified address.
     * @param owner The owner of the new DIN.
     */
    function registerNewDINFor(address owner) {
        register(owner);
    }

    /**
     * Registers a new DIN to the address that calls this function.
     */
    function registerNewDIN() {
        register(msg.sender);
    }

    // Helper function
    function register(address owner) private {
        // Increment the DIN index
        index++;
        // Register the DIN to the address that calls this function
        registry.register(index, owner);
        NewRegistration(index, owner);
    }


}