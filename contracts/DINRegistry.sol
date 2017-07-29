import './DINRegistrar.sol';

pragma solidity ^0.4.11;

/**
*  This contract is the Decentralized Identification Number (DIN) registry.
*/
contract DINRegistry {

    struct Record {
        address owner; // Address that owns the DIN.
        address market; // Address of the market associated with the DIN.
    }

    // DIN => Record
    mapping (uint => Record) records;

    // The address of the registrar contract to register new DINs.
    address public registrar;

    // The first DIN registered. Lower bound for DINs.
    uint public genesis;

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint indexed DIN, address indexed newOwner, address indexed oldOwner);

    // Logged when the market associated with a DIN changes.
    event NewMarket(uint indexed DIN, address indexed market);

    // Logged when the address of the registrar contract changes.
    event NewRegistrar(address registrar);

    modifier only_owner(uint DIN) {
        require(records[DIN].owner == msg.sender);
        _;
    }

    modifier only_registrar {
        require(registrar == msg.sender);
        _;
    }

    modifier only_unregistered(uint DIN) {
        require (records[DIN].owner == 0x0);
        require (DIN > genesis);
        _;
    }

    /**
     * Constructs a new DIN registry.
     * @param _genesis The start index for DIN numbering.
     */
    function DINRegistry(uint _genesis) {
        genesis = _genesis;

        // Register the genesis DIN to Kiosk.
        records[genesis].owner = msg.sender;
    }

    /**
     * Register a new DIN.
     * @param DIN The DIN to register.
     * @param owner The account that will own the registered DIN.
     */
    function registerDIN(uint DIN, address owner) only_registrar only_unregistered(DIN) {
        records[DIN].owner = owner;
        NewOwner(DIN, owner, msg.sender);
    }

    /**
     * Register multiple new DINs.
     * @param DINs The DINs to register.
     * @param owner The account that will own the registered DINs.
     */
    function registerDINs(uint[] DINs, address owner) only_registrar {
        for (uint i = 0; i < DINs.length; i++) {
            registerDIN(i, owner);
        }
    }

    /**
     * Returns the address that owns the specified DIN.
     */
    function owner(uint DIN) constant returns (address) {
        return records[DIN].owner;
    }

    /**
    * Returns the address of the market for the specified DIN.
    */
    function market(uint DIN) constant returns (address) {
        return records[DIN].market;
    }

    /**
     * Sets the owner address for the specified DIN
     * @param DIN The DIN to update.
     * @param owner The address of the new owner.
     */
    function setOwner(uint DIN, address owner) only_owner(DIN) {
        records[DIN].owner = owner;
        NewOwner(DIN, owner, msg.sender);
    }

    /**
     * Sets the market for the specified DIN.
     * @param DIN The DIN to update.
     * @param market The address of the market.
     */
    function setMarket(uint DIN, address market) only_owner(DIN) {
        records[DIN].market = market;
        NewMarket(DIN, market);
    }

    /**
     * Sets the registrar for the DIN Registry.
     * @param _registrar The address of the new registrar.
     */
    function setRegistrar(address _registrar) only_owner(genesis) {
        registrar = _registrar;
        NewRegistrar(registrar);
    }

}
