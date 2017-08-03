import './DINRegistry.sol';

pragma solidity ^0.4.11;

/**
*  This is the registrar contract for the DINRegistry. DINs are distributed sequentially for now.
*/
contract DINRegistrar {

	// The latest DIN registered. This increments before a new DIN is registered.
    uint public index;

    DINRegistry public registry;

    /**
     * Constructor
     */
    function DINRegistrar(DINRegistry _registry) {
        registry = _registry;
        index = _registry.genesis();
    }

    // Logged when a new DIN is registered.
    event NewRegistration(uint indexed DIN, address indexed owner);

    /**
     * Registers a new DIN for the specified address.
     * @param owner The owner of the new DIN.
     */
    function registerNewDINFor(address owner) returns (uint256) {
        register(owner);
        return index;
    }

    /**
     * Registers a new DIN to the address that calls this function.
     */
    function registerNewDIN() returns (uint256) {
        register(msg.sender);
        return index;
    }

    // Helper function
    function register(address owner) private {
        // Increment the DIN index
        index++;
        // Register the DIN to the address that calls this function
        registry.registerDIN(index, owner);
        NewRegistration(index, owner);
    }

}