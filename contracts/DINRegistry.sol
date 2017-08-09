import './Market.sol';

pragma solidity ^0.4.11;

/**
*  This contract is the Decentralized Identification Number (DIN) registry.
*/
contract DINRegistry {

    struct Record {
        address owner; // Address that owns the DIN.
        Market market; // Address of the market associated with the DIN.
    }

    // DIN => Record
    mapping (uint => Record) records;

    // The first DIN registered.
    uint public genesis;

    // The current DIN index.
    uint public index;

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint indexed DIN, address indexed newOwner, address indexed oldOwner);

    // Logged when the market associated with a DIN changes.
    event NewMarket(uint indexed DIN, address indexed market);

    // Logged when a new DIN is registered.
    event NewRegistration(uint indexed DIN, address indexed owner);

    modifier only_owner(uint DIN) {
        require(records[DIN].owner == msg.sender);
        _;
    }

    modifier only_market(uint DIN) {
        require (market(DIN) == msg.sender);
        _;
    }

    /**
     * Constructs a new DIN registry.
     * @param _genesis The start index for DIN numbering.
     */
    function DINRegistry(uint _genesis) {
        genesis = _genesis;
        index = _genesis;

        // Register the genesis DIN to Kiosk. This will represent a DIN product.
        records[genesis].owner = msg.sender;
    }

    /**
     * Register a new DIN.
     * @param owner The account that will own the DIN.
     */
    function registerDINForOwner(address owner) 
        only_market(genesis) 
        returns (uint256)
    {
        index++;
        records[index].owner = owner;
        NewRegistration(index, owner);

        return index;
    }

    // Convenience method
    function registerDIN() {
        registerDINForOwner(msg.sender);
    }

    /**
     * Register multiple new DINs.
     * @param quantity The number of DINs to register.
     * @param owner The account that will own the registered DINs.
     */
    function registerDINsForOwner(uint256 quantity, address owner) only_market(genesis) {
        for (uint i = 0; i < quantity; i++) {
            registerDINForOwner(owner);
        }
    }

    // Convenience method
    function registerDINs(uint256 quantity) {
        registerDINsForOwner(quantity, msg.sender);
    }

    /**
     * Returns the address that owns the specified DIN.
     */
    function owner(uint DIN) constant returns (address) {
        return records[DIN].owner;
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
    * Returns the address of the market for the specified DIN.
    */
    function market(uint DIN) constant returns (Market) {
        return records[DIN].market;
    }

    /**
     * Sets the market for the specified DIN.
     * @param DIN The DIN to update.
     * @param market The address of the market.
     */
    function setMarket(uint DIN, Market market) only_owner(DIN) {
        records[DIN].market = market;
        NewMarket(DIN, market);
    }

}
