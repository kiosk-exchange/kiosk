pragma solidity ^0.4.11;

import "./Market.sol";
import "./Kiosk.sol";

/**
*  This is the Decentralized Identification Number (DIN) registry.
*/
contract DINRegistry {
    // The Kiosk contract.
    Kiosk public kiosk;

    struct Record {
        address owner; // Address that owns the DIN.
        address market; // Address of the market associated with the DIN.
    }

    // DIN => Record
    mapping (uint256 => Record) records;

    // The address of DIN Registrar.
    address public registrarAddr;

    // The first DIN registered.
    uint256 public genesis;

    modifier only_registrar {
        require(registrarAddr == msg.sender);
        _;
    }

    modifier only_owner(uint256 DIN) {
        require(records[DIN].owner == msg.sender);
        _;
    }

    // Constructor
    function DINRegistry(Kiosk _kiosk, uint256 _genesis) {
        kiosk = _kiosk;
        genesis = _genesis;

        // Register the genesis DIN to Kiosk. This represents a DIN product.
        records[genesis].owner = msg.sender;
        NewRegistration(genesis, msg.sender);

        updateKiosk();
    }

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint256 indexed DIN, address indexed owner);

    // Logged when the market associated with a DIN changes.
    event NewMarket(uint256 indexed DIN, address indexed market);

    // Logged when a new DIN is registered.
    event NewRegistration(uint256 indexed DIN, address indexed owner);

    /**
     * Returns the address that owns the specified DIN.
     */
    function owner(uint256 DIN) constant returns (address) {
        return records[DIN].owner;
    }

    /**
     * Sets the owner address for the specified DIN
     * @param DIN The DIN to update.
     * @param owner The address of the new owner.
     */
    function setOwner(uint256 DIN, address owner) only_owner(DIN) {
        records[DIN].owner = owner;
        NewOwner(DIN, owner);
    }

    /**
    * Returns the address of the market for the specified DIN.
    */
    function market(uint256 DIN) constant returns (address) {
        return records[DIN].market;
    }

    /**
     * Sets the market for the specified DIN.
     * @param DIN The DIN to update.
     * @param market The address of the market.
     */
    function setMarket(uint256 DIN, address market) only_owner(DIN) {
        records[DIN].market = market;
        NewMarket(DIN, market);
    }

    /**
     * Register a new DIN.
     * @param owner The account that will own the DIN.
     */
    function register(uint256 DIN, address owner) only_registrar {
        records[DIN].owner = owner;
        NewRegistration(DIN, owner);
    }

    // Update Kiosk protocol contracts if they change on Kiosk
    function updateKiosk() {
        // Update DIN Registrar
        registrarAddr = kiosk.registrar();
    }

}