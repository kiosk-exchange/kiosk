pragma solidity ^0.4.11;

import "../StandardMarket.sol";
import "../Product.sol";
import "../Buyer.sol";
import "../OrderStore.sol";
import "../KioskMarketToken.sol";

/**
*  EtherMarket exchanges KMT for ETH. It also sells ETH as a Kiosk Product.
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
	function EtherMarket(KioskMarketToken _KMT) StandardMarket(_KMT) {
		// Register a DIN to this contract. 
		// Any exchange from KMT back into Ether will exist on this contract and can be resold.
		uint256 DIN = registerDIN();

		// Set the market for the newly registered DIN to this contract.
		registry.setMarket(DIN, this);

		ethDIN = DIN;
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

	/**
	*	==============================
	*	          Market
	*	==============================
	*/

	function buy(uint256 orderID) only_buyer returns (bool) {
        uint256 DIN = orderStore.DIN(orderID);

        require (DIN == ethDIN);

        uint256 quantity = orderStore.quantity(orderID);
        address buyer = orderStore.buyer(orderID);

        uint256 etherQuantity = quantity * 10**18;

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

	// TODO: This should implement some logic to prove it is a fair market.
	function isFulfilled(uint256 orderID) constant returns (bool) {
		return true;
	}

	function nameOf(uint256 DIN) constant returns (string) {
		require(DIN == ethDIN);
		return "1 Ether (ETH)";
	}

	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		require(DIN == ethDIN);
		return quantity * rate * 10**18; // 10^18 wei per ether
	}

	function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		require(DIN == ethDIN);
		return (this.balance >= quantity);
	}

	function registerDIN() private returns (uint256) {
		// Register a new DIN.
		uint256 genesis = registry.genesis();

		// Buy one DIN.
		uint256 orderID = KMT.buy(genesis, 1, 0);

		// Convert the order metadata to the registered DIN.
		return uint256(orderStore.metadata(orderID));
	}

}