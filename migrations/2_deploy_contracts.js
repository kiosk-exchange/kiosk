var DINRegistry = artifacts.require('./DINRegistry.sol');
var DINRegistrar = artifacts.require('./DINRegistrar.sol');
var PublicProduct = artifacts.require('./PublicProduct.sol');
var PriceResolver = artifacts.require('./PriceResolver.sol');
var DemoToken = artifacts.require('./DemoToken.sol');

module.exports = function(deployer) {

	const genesis = 10000000

	// Deploy DINRegistry
	deployer.deploy(DINRegistry, genesis).then(() => {
		// Deploy DINRegistrar
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		// Deploy PublicProduct
		return deployer.deploy(PublicProduct, DINRegistry.address)
	}).then(() => {
		return DINRegistry.deployed()
	}).then((registry) => {
		return registry.setRegistrar(DINRegistrar.address)
	}).then(() => {
		return deployer.deploy(DemoToken)
	})

};
