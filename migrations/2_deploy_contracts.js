const web3 = new (require('web3'))()
const DINRegistry = artifacts.require('./DINRegistry.sol')
const OrderTracker = artifacts.require('./OrderTracker.sol')
const ENSMarket = artifacts.require('./ENSMarket/ENSMarket.sol')
const ENSPublicProduct = artifacts.require('./ENSMarket/ENSPublicProduct.sol')
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

module.exports = function(deployer, network, accounts) {

	const tld = 'eth'
	const rootNode = getRootNodeFromTLD(tld)
	const subnodeSHA3 = web3.sha3('example')
	const subnodeName = 'example.eth'
	const subnodeNameHash = namehash(subnodeName)
	const price = web3.toWei(2, 'ether')
	const genesis = 1000000000
	const account1 = accounts[0]

	// Deploy the ENS
	deployer.deploy(ENS).then(() => {
		// Deploy the FIFSRegistrar and bind it with ENS
  	return deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash)
  }).then(() => {
  	// Transfer the owner of the `rootNode` to the FIFSRegistrar
    return ENS.at(ENS.address).setSubnodeOwner('0x0', rootNode.sha3, FIFSRegistrar.address)
  }).then(() => {
  	// Register "example.eth" to a test account
  	return FIFSRegistrar.at(FIFSRegistrar.address).register(subnodeSHA3, account1)
  }).then(() => {
		// Deploy the DIN Registry
		return deployer.deploy(DINRegistry, genesis)
	}).then(() => {
		return deployer.deploy(OrderTracker, DINRegistry.address)
	}).then(() => {
		// Deploy ENS Market, where ENS domains can be bought and sold
		return deployer.deploy(ENSMarket, DINRegistry.address, OrderTracker.address, ENS.address)
	}).then(() => {
		return deployer.deploy(
			ENSPublicProduct, 
			DINRegistry.address, 
			ENSMarket.address, 
			ENS.address
		)
	}).then(() => {
		// List "example.eth" on ENSMarket
		return ENSPublicProduct.at(ENSPublicProduct.address).addENSDomain(subnodeName, subnodeNameHash, price)
	}).then(() => {
		// Transfer ownership of "example.eth" to the ENSPublicProduct
		return ENS.at(ENS.address).setOwner(subnodeNameHash, ENSPublicProduct.address)
	})

}