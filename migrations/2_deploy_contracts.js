const web3 = new (require('web3'))()
const DINRegistry = artifacts.require('./DINRegistry.sol')
const DINRegistrar = artifacts.require('./DINRegistrar.sol')
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

module.exports = function(deployer) {

	const genesis = 10000000
	const tld = 'eth'
	const subnodeSHA3 = web3.sha3('example')
	const subnodeNameHash = namehash('example.eth')
	const rootNode = getRootNodeFromTLD(tld)
	const price = web3.toWei(2, 'ether')

  // Deploy the ENS
	deployer.deploy(ENS).then(() => {
		// Deploy the FIFSRegistrar and bind it with ENS
  	return deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash)
  }).then(() => {
  	// Transfer the owner of the `rootNode` to the FIFSRegistrar
    return ENS.at(ENS.address).setSubnodeOwner('0x0', rootNode.sha3, FIFSRegistrar.address)
  }).then(() => {
  	// Register "example.eth" to a test account
  	return FIFSRegistrar.at(FIFSRegistrar.address).register(subnodeSHA3, "0xff93a94c342668b281d3cd7d7a301c4c699eaac0")
  }).then(() => {
		// Deploy the DIN Registry
		return deployer.deploy(DINRegistry, genesis)
	}).then(() => {
		// Deploy the DIN Registrar and bind it with the DIN Registry
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		// Set the DIN registry's registrar to the deployed registrar
		return DINRegistry.at(DINRegistry.address).setRegistrar(DINRegistrar.address)
	}).then(() => {
		// Deploy ENS Market, where ENS domains can be bought and sold
		return deployer.deploy(ENSMarket, DINRegistry.address, ENS.address)
	}).then(() => {
		// Sell "example.eth" on ENSMarket
		return deployer.deploy(
			ENSPublicProduct, 
			DINRegistry.address, 
			DINRegistrar.address, 
			ENSMarket.address, 
			ENS.address
		)
	}).then(() => {
		return ENSPublicProduct.at(ENSPublicProduct.address).addENSDomain(subnodeNameHash, price)
	})

}