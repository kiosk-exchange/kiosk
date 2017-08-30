pragma solidity ^0.4.11;

import "./KioskMarketToken.sol";
import "./Buyer.sol";
import "./DINRegistry.sol";
import "./DINRegistrar.sol";
import "./OrderMaker.sol";
import "./OrderStore.sol";
import "./Market.sol";
import "./Product.sol";
import "./OrderUtils.sol";

/**
*  This is a base implementation of a Market that is used by Kiosk's market contracts (DINMarket, EtherMarket, ENSMarket, etc.).
*  Subclasses must implement name, nameOf, isFulfilled, and metadata.
*/
contract StandardMarket is Market {

    // The Kiosk Market Token contract.
    KioskMarketToken public KMT;

    // The Buyer contract from the Kiosk protocol.
    Buyer public buyer;

    // The DINRegistry contract from the Kiosk protocol.
    DINRegistry public registry;

    // The DINRegistrar contract from the Kiosk protocol.
    DINRegistrar public registrar;

    // The OrderMaker contract from the Kiosk protocl.
    OrderMaker public orderMaker;

    // The OrderStore contract from the Kiosk protocl.
    OrderStore public orderStore;

    // Only let the Buyer contract call "buy"
    modifier only_buyer {
        require (buyer == msg.sender);
        _;
    }

    // This contract does not accept Ether transfers.
    function () {
        throw;
    }

    // Constructor
    function StandardMarket(KioskMarketToken _KMT) {
        KMT = _KMT;
        updateKiosk();
    }

    // Update Kiosk protocol contracts if they change on Kiosk Market Token
    function updateKiosk() {
        // Update Buyer
        address buyerAddr = KMT.buyer();
        buyer = Buyer(buyerAddr);

        // Update DINRegistry
        address registryAddr = KMT.registry();
        registry = DINRegistry(registryAddr);

        // Update DINRegistrar
        address registrarAddr = KMT.registrar();
        registrar = DINRegistrar(registrarAddr);

        // Update OrderMaker
        address orderMakerAddr = KMT.orderMaker();
        orderMaker = OrderMaker(orderMakerAddr);

        address orderStoreAddr = KMT.orderStore();
        orderStore = OrderStore(orderStoreAddr);
    }

}
