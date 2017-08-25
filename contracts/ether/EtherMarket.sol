pragma solidity ^0.4.11;

import "../PublicMarket.sol";
import "../Product.sol";
import "../KioskMarketToken.sol";
import "../OrderTracker.sol";

/**
*  EtherMarket exchanges KMT for ETH. It also sells ETH as a Kiosk Product.
*/
contract EtherMarket is PublicMarket, Product {

	// The DIN for ETH
	uint256 public ETH_DIN;

	// How many KMT a buyer gets per wei.
	uint256 public rate = 300;

	// Order ID => Initial ETH balance of buyer
	mapping (uint256 => uint256) public initialBalances;

	// Constructor
	function EtherMarket(KioskMarketToken _KMT, uint256 _DIN) PublicMarket(_KMT) {
		ETH_DIN = _DIN;
		products[_DIN].priceResolver = this;
		products[_DIN].inventoryResolver = this;
		products[_DIN].buyHandler = this;
	}

	// Get KMT
	function contribute() payable {
		// KMT to issue
		uint256 issuableKMT = msg.value * rate;

		// Throw if this contract doesn't have enough KMT
		require(KMT.balanceOf(this) >= issuableKMT);

		// Transfer KMT to the buyer
		KMT.transfer(msg.sender, issuableKMT);
	}

	// TODO: Add withdraw logic
	function withdraw() {}

	function orderData(uint256 DIN, address buyer) constant returns (bytes32) {
		// You're buying ether in this market.
		return keccak256("Ether");
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		return true;
	}

	// Override buy to store the buyer's initial ETH balance
	// function buy(uint256 orderID) returns (bool) {
	// }

	// Kiosk Protocol
	function name(uint256 DIN) constant returns (string) {
		require(DIN == ETH_DIN);
		return "Ether (ETH), in wei";
	}

	// Product
	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		require(DIN == ETH_DIN);
		return quantity / rate;
	}

	function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
		require(DIN == ETH_DIN);
		return (KMT.balanceOf(this) >= quantity);
	}

	function handleOrder(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) {
		require(DIN == ETH_DIN);
		// Throw if this contract doesn't have enough ETH
		require (this.balance >= quantity);
		// Transfer ETH to the buyer
		buyer.transfer(quantity);
	}

}