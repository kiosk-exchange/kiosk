pragma solidity ^0.4.11;

import "../StandardMarket.sol";
import "../Kiosk.sol";
import "../Buy.sol";
import "../OrderStore.sol";

/**
*  EtherMarket exchanges ETH for KMT. It also sells ETH as a Kiosk Product.
*/
contract EtherMarket is StandardMarket {
    string public name = "Ether Market";

    // The DIN for ETH
    uint256 public ethDIN;

    // How many KMT a buyer gets per wei.
    uint256 public rate = 300;

    // Order ID => Initial ETH balance of buyer
    mapping (uint256 => uint256) public initialBalances;

    // Constructor
    function EtherMarket(Kiosk _kiosk) StandardMarket(_kiosk) {
        // Register a DIN to this contract. 
        ethDIN = buyContract.buyDIN();

        // Set the market for the newly registered DIN to this contract.
        registry.setMarket(ethDIN, this);
    }

    // Get KMT
    function contribute() payable {
        // KMT to issue
        uint256 issuableKMT = msg.value.mul(rate);

        // Throw if this contract doesn't have enough KMT
        require(KMT.balanceOf(this) >= issuableKMT);

        // Transfer KMT to the buyer
        KMT.transfer(msg.sender, issuableKMT);
    }

    /**
    *  ==============================
    *	           Market
    *  ==============================
    */

    function buy(
        uint256 DIN,
        uint256 quantity,
        uint256 value,
        address buyer,
        bool approved
    ) 	
        only_buy
        returns (bool) 
    {
        require (DIN == ethDIN);

        uint256 etherQuantity = quantity.mul(10**18);

        // Throw if this contract doesn't have enough ETH
        require (this.balance >= etherQuantity);

        // Transfer ETH to the buyer
        buyer.transfer(etherQuantity);

        return true;
    }

    function metadata(uint256 DIN) constant returns (bytes32) {
        require (DIN == ethDIN);
		
        // You're buying ether in this market.
        return keccak256(nameOf(DIN));
    }

    function isFulfilled(uint256 orderID) constant returns (bool) {
        return true;
    }

    function nameOf(uint256 DIN) constant returns (string) {
        require(DIN == ethDIN);
        return "1 Ether (ETH)";
    }

    function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
        require(DIN == ethDIN);
        return quantity.mul(rate).mul(10**18); // 10^18 wei per ether
    }

    function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
        require(DIN == ethDIN);
        return (this.balance >= quantity);
    }

}