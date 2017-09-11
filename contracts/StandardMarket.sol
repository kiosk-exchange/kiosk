pragma solidity ^0.4.11;

import "./Kiosk.sol";
import "./KioskMarketToken.sol";
import "./Buy.sol";
import "./DINRegistry.sol";
import "./DINRegistrar.sol";
import "./OrderMaker.sol";
import "./OrderStore.sol";
import "./Market.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

/**
*  This is a base implementation of a Market that is used by Kiosk's market contracts (DINMarket, EtherMarket, ENSMarket, etc.).
*  Subclasses must implement name, nameOf, isFulfilled, and metadata.
*/
contract StandardMarket is Market {
    using SafeMath for uint256;

    // The Kiosk contract.
    Kiosk public kiosk;

    // The Kiosk Market Token contract.
    KioskMarketToken public KMT;

    // The Buy contract from the Kiosk protocol.
    Buy public buyContract;

    // The DINRegistry contract from the Kiosk protocol.
    DINRegistry public registry;

    // The DINRegistrar contract from the Kiosk protocol.
    DINRegistrar public registrar;

    // The OrderMaker contract from the Kiosk protocl.
    OrderMaker public orderMaker;

    // The OrderStore contract from the Kiosk protocl.
    OrderStore public orderStore;

    // Only let the Buy contract call "buy"
    modifier only_buy {
        require (kiosk.isValid(msg.sender) == true);
        _;
    }

    modifier only_owner(uint256 DIN) {
        require (registry.owner(DIN) == msg.sender);
        _;
    }

    // This contract does not accept Ether transfers.
    function () {
        throw;
    }

    // Constructor
    function StandardMarket(Kiosk _kiosk) {
        kiosk = _kiosk;
        updateKiosk();
    }

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
    function updateKiosk() {
        // Update Kiosk Market Token
        address kmtAddr = kiosk.KMT();
        KMT = KioskMarketToken(kmtAddr);

        // Update Buy
        address buyAddr = kiosk.buy();
        buyContract = Buy(buyAddr);

        // Update DINRegistry
        address registryAddr = kiosk.registry();
        registry = DINRegistry(registryAddr);

        // Update DINRegistrar
        address registrarAddr = kiosk.registrar();
        registrar = DINRegistrar(registrarAddr);

        // Update OrderMaker
        address orderMakerAddr = kiosk.orderMaker();
        orderMaker = OrderMaker(orderMakerAddr);

        address orderStoreAddr = kiosk.orderStore();
        orderStore = OrderStore(orderStoreAddr);
    }

}
