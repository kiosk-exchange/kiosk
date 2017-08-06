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

module.exports = function(deployer) {

	const genesis = 10000000
	const tld = 'eth'
	const subnode = namehash('example.eth')
	const rootNode = getRootNodeFromTLD(tld)
	const price = web3.toWei(1, 'ether')

  // Deploy the ENS
	deployer.deploy(ENS).then(() => {
		// Deploy the FIFSRegistrar and bind it with ENS
  	return deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash)
  }).then(() => {
  	// Transfer the owner of the `rootNode` to the FIFSRegistrar
    return ENS.at(ENS.address).setSubnodeOwner('0x0', rootNode.sha3, FIFSRegistrar.address)
  }).then(() => {
  	// Register "example.eth" to a test account
  	return FIFSRegistrar.at(FIFSRegistrar.address).register(subnode, "0x25b7750d66350ceb0c4cdc1096e35fc27b6d41cc")
  }).then(() => {
		// Deploy the DIN Registry
		return deployer.deploy(DINRegistry, genesis)
	}).then(() => {
		// Deploy the DIN Registrar and bind it with the DIN Registry
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		return DINRegistry.deployed()
	}).then((registry) => {
		// Set the DIN registry's registrar to the deployed registrar
		registry.setRegistrar(DINRegistrar.address)
	}).then(() => {
		// Deploy ENS Market, where ENS domains can be bought and sold
		return deployer.deploy(ENSMarket, DINRegistry.address, ENS.address)
	}).then(() => {
		// Sell "example.eth" on ENSMarket
		return deployer.deploy(
			ENSProduct, 
			DINRegistry.address, 
			DINRegistrar.address, 
			ENSMarket.address, 
			ENS.address, 
			price, 
			subnode
		)
	})

}