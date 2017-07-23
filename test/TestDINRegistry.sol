pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DINRegistry.sol";

contract TestDINRegistry {

  DINRegistry registry;
  uint genesis = 10000000;

  address account1 = 0xc41da6fbc28155c185e4d6344cde4f90a9c42deb; // TestRPC
  address account2 = 0x0fe8099fb8b2a6a8db4868398350127668341cd2;

  function beforeEach() {
    registry = new DINRegistry(genesis);
  }

  function testGenesisNumber() {
    uint index = registry.index();
    Assert.equal(genesis, index, "Index should be genesis number");
  }

  function testRegister() returns (uint) {
    // I can't figure out how to get registerNewDIN to work
    registry.registerNewDINFor(account1);
    uint DIN = registry.index();
    Assert.equal(genesis + 1, DIN, "Registered DIN should be genesis number plus 1");

    return DIN;
  }

  function testRegisterOwnership() {
    uint DIN = testRegister();

    address owner = registry.owner(DIN);
    Assert.equal(owner, account1, "Registering a new DIN should set its owner correctly");
  }

  function testTransferOwnership() {
    uint DIN = testRegister();

    registry.setOwner(DIN, account2);
    address owner = registry.owner(DIN);
    
    Assert.equal(owner, account2, "DIN owner should be able to transfer ownership");
  }


}