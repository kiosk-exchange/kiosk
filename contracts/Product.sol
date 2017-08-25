pragma solidity ^0.4.11;

import "./PriceResolver.sol";
import "./InventoryResolver.sol";
import "./BuyHandler.sol";

// Product is a wrapper around product resolvers for convenience
contract Product is PriceResolver, InventoryResolver, BuyHandler {}