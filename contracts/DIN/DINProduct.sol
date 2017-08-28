pragma solidity ^0.4.11;

import "../KioskMarketToken.sol";
import "../DINRegistrar.sol";
import "../Product.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract DINProduct is Product {
	using SafeMath for uint256;

	KioskMarketToken public KMT;				// The Kiosk Market Token contract.
	DINRegistrar public registrar;				// The DIN Registrar contract.
	mapping (address => uint256) owned;			// The number of DINs owned by a given account.
	uint256 public free; 						// The number of DINs that can be registered for free.
	uint256 public price; 						// Nominal price to discourage excessive / unused DIN registrations.

	// Constructor
	function DINProduct(KioskMarketToken _KMT, uint256 _price, uint256 _free) {
		KMT = _KMT;
		price = _price;
		free = _free;

		updateKiosk();
	}

	function productTotalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		uint256 freeCount = 0;

		// Find out how many free DINs the buyer has remaining.
		if (free > owned[buyer]) {
			freeCount = free.sub(owned[buyer]);
		}

		return price.mul(quantity.sub(freeCount));		
	}

	function productAvailableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		return true;
	}

	function fulfill(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) {
		// Increment the number of DINs the buyer owns.
		owned[buyer] = owned[buyer].add(quantity);
		registrar.registerDINsForOwner(quantity, buyer);
	}

	function setPrice(uint256 _price) {
		price = _price;
	}

	function setFree(uint256 _free) {
		free = _free;
	}

	// Update Kiosk protocol contracts if they change on Kiosk Market Token
	function updateKiosk() {
		address registrarAddr = KMT.registrar();
		registrar = DINRegistrar(registrarAddr);
	}

}
