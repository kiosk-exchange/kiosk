pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DINRegistry.sol";
import "../contracts/KioskResolver.sol";
import "../contracts/PriceResolver.sol";

contract TestProductResolver {

	DINRegistry registry;
	KioskResolver productResolver;
	PriceResolver priceResolver;

	uint genesis = 10000000;
	uint DIN = 10000001;

	address account1 = 0xc41da6fbc28155c185e4d6344cde4f90a9c42deb; // TestRPC

	function beforeEach() {
    registry = new DINRegistry(genesis);
    productResolver = new KioskResolver(registry);
    priceResolver = new PriceResolver();

    registry.registerNewDINFor(account1);
  }

  function testSetPriceResolver() {
  	productResolver.setPriceResolver(DIN, priceResolver);
  	uint price = productResolver.price(DIN);
  	uint expected = 0.25 ether;

  	Assert.equal(price, expected, "It should set the price resolver, which has a price of 0.25 ether for every product");
  }

}