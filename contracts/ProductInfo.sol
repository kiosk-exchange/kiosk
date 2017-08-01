pragma solidity ^0.4.11;

/**
*  This is the interface for a product info resolver.
*/
contract ProductInfo {
  function name(uint256 DIN) constant returns (string);
}
