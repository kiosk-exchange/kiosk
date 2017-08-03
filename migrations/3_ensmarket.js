var DINRegistry = artifacts.require('./DINRegistry.sol')
var DINRegistrar = artifacts.require('./DINRegistrar.sol')
var ENS = artifacts.require('./ENS/ENS.sol')
var ENSMarket = artifacts.require('./ENS/ENSMarket.sol')
var ENSProduct = artifacts.require('./ENS/ENSProduct.sol')

module.exports = function(deployer) {

	const genesis = 10000000

	deployer.deploy(ENS).then(() => {
		// Deploy a new DIN Registry
		return deployer.deploy(DINRegistry, genesis)
	}).then(() => {
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
	}).then(() => {
		// Deploy ENS Product, which allows sellers to list ENS domains on the market.
		return deployer.deploy(ENSProduct, DINRegistrar.address, ENSMarket.address, ENS.address)
	})

}