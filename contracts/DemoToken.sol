pragma solidity ^0.4.11;

import './PriceResolver.sol';
import './InventoryResolver.sol';
import './BuyHandler.sol';

/**
*  This is an example of a token that can be distributed as a Product
*/
contract DemoToken is PriceResolver, InventoryResolver, BuyHandler {
}