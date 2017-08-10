import './DINRegistry.sol';
import './PublicMarket.sol';
import './InfoResolver.sol';
import './PriceResolver.sol';
import './InventoryResolver.sol';
import './BuyHandler.sol';

pragma solidity ^0.4.11;

/**
*  This is the interface for a product.
*/
contract Product is InfoResolver, PriceResolver, InventoryResolver, BuyHandler {

	PublicMarket public market;
	DINRegistry public registry;

  modifier only_owner(uint256 DIN) {
      require (registry.owner(DIN) == msg.sender);
      _;
  }

  modifier only_market() {
		require (market == msg.sender);
		_;
  }

  // Constructor
  function Product(PublicMarket _market, DINRegistry _registry) {
  	market = _market;
  	registry = _registry;
  }

}