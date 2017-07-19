pragma solidity ^0.4.11;

/**
*  This contract is the Decentralized Identification Number (DIN) registry.
*/
contract DINRegistry {

    struct Record {
        address owner; // Address that registers the DIN
        address resolver; // Address of the resolver contract. Resolvers store product information and process orders.
    }

    // DIN => Record
    mapping (uint => Record) records;

    // The latest DIN registered. This increments before a new DIN is registered.
    uint public index;

    // Logged when a new DIN is registered.
    event NewRegistration(uint indexed DIN, address indexed owner);

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint indexed DIN, address indexed owner);

    // Logged when the resolver for a DIN changes.
    event NewResolver(uint indexed DIN, address indexed resolver);

    /**
    * Only the owner of the specified DIN may call functions with this modifier
    */
    modifier only_owner(uint DIN) {
        if (records[DIN].owner != msg.sender) throw;
        _;
    }

    /**
     * Constructs a new DIN registry.
     * @param genesis The start index for DIN numbering.
     */
    function DINRegistry(uint genesis) {
        index = genesis;
    }

    /**
     * Returns the address that owns the specified DIN.
     */
    function owner(uint DIN) constant returns (address) {
        return records[DIN].owner;
    }

    /**
     * Returns the address of the resolver for the specified DIN.
     */
    function resolver(uint DIN) constant returns (address) {
        return records[DIN].resolver;
    }

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

    /**
     * Sets the owner address for the specified DIN
     * @param DIN The DIN to update.
     * @param owner The address of the new owner.
     */
    function setOwner(uint DIN, address owner) only_owner(DIN) {
        records[DIN].owner = owner;
        NewOwner(DIN, owner);
    }

    /**
     * Sets the resolver address for the specified DIN.
     * @param DIN The DIN to update.
     * @param resolver The address of the resolver.
     */
    function setResolver(uint DIN, address resolver) only_owner(DIN) {
        records[DIN].resolver = resolver;
        NewResolver(DIN, resolver);
    }

    // Helper function
    function register(address owner) private {
        // Increment the DIN index
        index++;
        // Register the DIN to the address that calls this function
        records[index].owner = owner;
        NewRegistration(index, owner);
    }
}
