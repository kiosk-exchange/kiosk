import './DINRegistrar.sol';
import './ProductInfo.sol';
import './PublicMarket.sol';
import './PriceResolver.sol';
import './InventoryResolver.sol';
import './BuyHandler.sol';

pragma solidity ^0.4.11;

/**
*  This is the interface for a product.
*/
contract Product is ProductInfo, PriceResolver, InventoryResolver, BuyHandler {

	address public owner;
	DINRegistrar public registrar;
	PublicMarket public market;

	modifier only_owner() {
    require (owner == msg.sender);
    _;
  }

  modifier only_market() {
		require (market == msg.sender);
		_;
  }

  // Constructor
  function Product(DINRegistrar _registrar, PublicMarket _market) {
  	owner = msg.sender;
  	registrar = _registrar;
  	market = _market;
  }

	function price(uint256 DIN, address buyer) constant returns (uint256);

	function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256) {
		return price(DIN, buyer) * quantity;
	}

	function setOwner(address _owner) only_owner {
		owner = _owner;
	}

	function setMarket(PublicMarket _market) only_owner {
		market = _market;
	}

}