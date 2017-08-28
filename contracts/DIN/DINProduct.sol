pragma solidity ^0.4.11;

import "../KioskMarketToken.sol";
import "../Market.sol";
import "../DINRegistrar.sol";
import "../Product.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract DINProduct is Product {
	using SafeMath for uint256;

	DINRegistrar public registrar;				// The DIN Registrar contract.
	mapping (address => uint256) owned;			// The number of DINs owned by a given account.
	uint256 public free; 						// The number of DINs that can be registered for free.
	uint256 public price; 						// Nominal price to discourage excessive / unused DIN registrations.
	uint256 public supportedDIN;

	// Constructor
	function DINProduct(
		KioskMarketToken _KMT,
		address _market, 
		uint256 _price, 
		uint256 _free
	) Product(_KMT, _market) {
		supportedDIN = registry.genesis();
		price = _price;
		free = _free;
	}

	function productTotalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		require(DIN == supportedDIN);

		uint256 freeCount = 0;

		// Find out how many free DINs the buyer has remaining.
		if (free > owned[buyer]) {
			freeCount = free.sub(owned[buyer]);
		}

		// If the buyer has enough free DINs remaining, the price is zero.
		if (quantity <= freeCount) {
			return 0;
		}

		// Otherwise, calculate the price.
		return price.mul(quantity.sub(freeCount));		
	}

	function productAvailableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool) {
		require(DIN == supportedDIN);

		return true;
	}

	function fulfill(uint256 orderID, uint256 DIN, uint256 quantity, address buyer) only_market {
		require(DIN == supportedDIN);

		// Increment the number of DINs the buyer owns.
		owned[buyer] = owned[buyer].add(quantity);
		registrar.registerDINsForOwner(quantity, buyer);
	}

	function setPrice(uint256 _price) only_owner(DIN) {
		price = _price;
	}

	function setFree(uint256 _free) only_owner(DIN) {
		free = _free;
	}

	// Override update Kiosk to include DINRegistrar as well.
	function updateKiosk() {
		super.updateKiosk();

		address registrarAddr = KMT.registrar();
		registrar = DINRegistrar(registrarAddr);
	}

}
