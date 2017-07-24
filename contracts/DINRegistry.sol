pragma solidity ^0.4.11;

import './DINRegistrar.sol';

/**
*  This contract is the Decentralized Identification Number (DIN) registry.
*/
contract DINRegistry {

    struct Record {
        address owner; // Address that owns the DIN.
        address product; // Address of the product associated with the DIN.
    }

    // DIN => Record
    mapping (uint => Record) public records;

    // The address of the registrar contract to register new DINs.
    address public registrar;

    // The first DIN registered. Lower bounds for DINs.
    uint public genesis;

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint indexed DIN, address indexed owner);

    // Logged when the product associated with a DIN changes.
    event NewProduct(uint indexed DIN, address indexed product);

    // Logged when the address of the registrar contract changes.
    event NewRegistrar(address registrar);

    modifier only_owner(uint DIN) {
        if (records[DIN].owner != msg.sender) throw;
        _;
    }

    modifier only_registrar() {
        if (registrar != msg.sender) throw;
        _;
    }

    modifier only_unregistered(uint DIN) {
        if (records[DIN].owner > 0 || DIN < genesis) throw;
        _;
    }

    /**
     * Constructs a new DIN registry.
     * @param genesis The start index for DIN numbering.
     */
    function DINRegistry(uint genesis) {
        // Register the genesis DIN to Kiosk.
        records[genesis].owner = msg.sender;
        genesis = genesis;
    }

    /**
     * Register a new DIN.
     * @param DIN The DIN to register.
     * @param owner The account that will own the registered DIN.
     */
    function register(uint DIN, address owner) only_registrar() only_unregistered(DIN) {
        records[DIN].owner = owner;
        NewOwner(DIN, owner);
    }

    /**
     * Register multiple new DINs.
     * @param DINs The DINs to register.
     * @param owner The account that will own the registered DINs.
     */
    function register(uint[] DINs, address owner) only_registrar() {
        for (uint i = 0; i < DINs.length; i++) {
            register(i, owner);
        }
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

    /**
     * Sets the registrar for the DIN Registry.
     * @param registrar The address of the new registrar.
     */
     function setRegistrar(address registrar) only_owner(genesis) {
        registrar = registrar;
        NewRegistrar(registrar);
     }

}
