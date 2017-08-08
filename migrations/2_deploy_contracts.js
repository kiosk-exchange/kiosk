const web3 = new (require('web3'))()
const DINRegistry = artifacts.require('./DINRegistry.sol')
const DINRegistrar = artifacts.require('./DINRegistrar.sol')
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

const deployENS = (deployer) => new Promise((resolve, reject) => {
	const tld = 'eth'
	const rootNode = getRootNodeFromTLD(tld)
	const subnodeSHA3 = web3.sha3('example')


	// Deploy the ENS
		return deployer.deploy(ENS).then(() => {
		// Deploy the FIFSRegistrar and bind it with ENS
  	return deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash)
  }).then(() => {
  	// Transfer the owner of the `rootNode` to the FIFSRegistrar
    return ENS.at(ENS.address).setSubnodeOwner('0x0', rootNode.sha3, FIFSRegistrar.address)
  }).then(() => {
  	// Register "example.eth" to a test account
  	return FIFSRegistrar.at(FIFSRegistrar.address).register(subnodeSHA3, "0x13e67388ce5194ac4d7d3391ec06bccc56de0104")
  }).then(() => {
  	resolve(ENS.address)
  })

})

const deployDINRegistry = (deployer) => new Promise((resolve, reject) => {
	const genesis = 10000000

	// Deploy the DIN Registry
	deployer.deploy(DINRegistry, genesis).then(() => {
		// Deploy the DIN Registrar and bind it with the DIN Registry
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		console.log("2")
		console.log(DINRegistrar.address)
		// Set the DIN registry's registrar to the deployed registrar
		return DINRegistry.at(DINRegistry.address).setRegistrar(DINRegistrar.address)
	}).then(() => {
		results = {
			registry: DINRegistry.address,
			registrar: DINRegistrar.address
		}
		resolve(results)
	})

})

const deployMarket = (deployer, registry, ens) => new Promise((resolve, reject) => {
	// Deploy the order tracker
  deployer.deploy(OrderTracker, registry).then(() => {
		// Deploy ENS Market, where ENS domains can be bought and sold
		return deployer.deploy(ENSMarket, registry, OrderTracker.address, ens)
	}).then(() => {
		resolve(ENSMarket.address)
	})

})

const deployENSProduct = (deployer, registry, registrar, market, ens) => new Promise((resolve, reject) => {
	const subnodeName = 'example.eth'
	const subnodeNameHash = namehash(subnodeName)
	const price = web3.toWei(2, 'ether')

	deployer.deploy(ENSPublicProduct, registry, registrar, market, ens).then(() => {
		// List "example.eth" on ENSMarket
		return ENSPublicProduct.at(ENSPublicProduct.address).addENSDomain(subnodeName, subnodeNameHash, price)
	}).then(() => {
		// Transfer ownership of "example.eth" to the ENSPublicProduct
		return ENS.at(ens).setOwner(subnodeNameHash, ENSPublicProduct.address)
	})

})


module.exports = function(deployer) {

	var DINRegistryAddr
	var DINRegistrarAddr
	var ENSMarketAddr
	var ENSAddr

	deployENS(deployer).then((ens) => {
		ENSAddr = ens
		return deployDINRegistry(deployer).then((results) => {
			DINRegistryAddr = results.registry
			DINRegistrarAddr = results.registrar
			return deployMarket(deployer, DINRegistryAddr, ENSAddr).then((market) => {
				ENSMarketAddr = market
				return deployENSProduct(deployer, DINRegistryAddr, DINRegistrarAddr, ENSMarketAddr, ENSAddr)
			})
		})
	})
}