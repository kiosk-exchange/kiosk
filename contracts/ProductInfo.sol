pragma solidity ^0.4.11;

/**
*  This is the interface for a product info resolver.
*/
contract ProductInfo {
  function retailURL(uint256 productID) constant returns (string);
  function imageURL(uint256 productID) constant returns (string);
}