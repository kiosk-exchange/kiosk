const web3 = new (require('web3'))()
const DINRegistry = artifacts.require('./DINRegistry.sol')
const DINRegistrar = artifacts.require('./DINRegistrar.sol')
const ENSMarket = artifacts.require('./ENSMarket/ENSMarket.sol')
const ENSProduct = artifacts.require('./ENSMarket/ENSProduct.sol')
const ENS = artifacts.require('.ENSMarket/ENS/ENS.sol')
const FIFSRegistrar = artifacts.require('.ENSMarket/ENS/FIFSRegistrar.sol')
const namehash = require('../node_modules/eth-ens-namehash')

// https://github.com/ethereum/ens/blob/master/migrations/2_deploy_contracts.js

/**
 * Calculate root node hashes given the top level domain(tld)
 *
 * @param {string} tld plain text tld, for example: 'eth'
 */
function getRootNodeFromTLD(tld) {
  return {
    namehash: namehash(tld),
    sha3: web3.sha3(tld)
  };
}

/**
 * Deploy the ENS and FIFSRegistrar
 *
 * @param {Object} deployer truffle deployer helper
 * @param {string} tld tld which the FIFS registrar takes charge of
 */
function deployFIFSRegistrar(deployer, tld) {
  var rootNode = getRootNodeFromTLD(tld);

  // Deploy the ENS first
  deployer.deploy(ENS)
    .then(() => {
      // Deploy the FIFSRegistrar and bind it with ENS
      return deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash);
    })
    .then(function() {
      // Transfer the owner of the `rootNode` to the FIFSRegistrar
      ENS.at(ENS.address).setSubnodeOwner('0x0', rootNode.sha3, FIFSRegistrar.address);
    });
}


module.exports = function(deployer) {

	const genesis = 10000000
	const tld = 'eth'

	// Use FIFS Registrar for simplicity in testing
	deployFIFSRegistrar(deployer, tld)

	// Deploy a new DIN Registry
	deployer.deploy(DINRegistry, genesis).then(() => {
		// Deploy a new DIN Registrar. The registrar will register new DINs in the registry.
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		return DINRegistry.deployed()
	}).then((instance) => {
		// Set the DIN registry's registrar to the deployed registrar
		instance.setRegistrar(DINRegistrar.address)
	}).then(() => {
		// Deploy ENS Market, where ENS domains can be bought and sold.
		return deployer.deploy(ENSMarket, DINRegistry.address, ENS.address)
	// }).then(() => {
		// Deploy ENS Product, which allows sellers to list ENS domains on the market.
		// return deployer.deploy(ENSProduct, DINRegistry.address, DINRegistrar.address, ENSMarket.address, ENS.address)
	})

}