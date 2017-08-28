pragma solidity ^0.4.11;

import "./PriceResolver.sol";
import "./InventoryResolver.sol";
import "./BuyHandler.sol";

contract Product {
	function fulfill(uint256 orderID);
	function productAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
	function productTotalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
}