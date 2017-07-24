pragma solidity ^0.4.11;

/**
*  This contract is the Decentralized Identification Number (DIN) registry.
*/
contract DINRegistry {

    struct Record {
        address owner; // Address that owns the DIN
        address product; // Address of the product associated with the DIN
    }

    // DIN => Record
    mapping (uint => Record) records;

    // The latest DIN registered. This increments before a new DIN is registered.
    uint public index;

    // Logged when a new DIN is registered.
    event NewRegistration(uint indexed DIN, address indexed owner);

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint indexed DIN, address indexed owner);

    // Logged when the product for a DIN changes.
    event NewProduct(uint indexed DIN, address indexed product);

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
     * Returns the address of the product for the specified DIN.
     */
    function product(uint DIN) constant returns (address) {
        return records[DIN].product;
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
     * Sets the product for the specified DIN.
     * @param DIN The DIN to update.
     * @param product The address of the product.
     */
    function setProduct(uint DIN, address product) only_owner(DIN) {
        records[DIN].product = product;
        NewProduct(DIN, product);
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
