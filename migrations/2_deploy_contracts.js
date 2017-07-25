var DINRegistry = artifacts.require('./DINRegistry.sol');
var DINRegistrar = artifacts.require('./DINRegistrar.sol');
var PublicProduct = artifacts.require('./PublicProduct.sol');
var PriceResolver = artifacts.require('./PriceResolver.sol');
var DemoToken = artifacts.require('./DemoToken.sol');

module.exports = function(deployer) {

	const genesis = 10000000
	const DIN = 10000001
	var registry;
	var registrar;
	var product;

	// Deploy DINRegistry
	deployer.deploy(DINRegistry, genesis).then(() => {
		// Deploy DINRegistrar
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		// Deploy PublicProduct
		return deployer.deploy(PublicProduct, DINRegistry.address)
	}).then(() => {
		return DINRegistry.deployed()
	}).then((instance) => {
		// Set the registrar on the DINRegistry
		registry = instance
		return registry.setRegistrar(DINRegistrar.address)
	}).then(() => {
		return DINRegistrar.deployed()
	}).then((instance) => {
		registrar = instance
		return registrar.registerNewDIN(); // Register 10000001
	}).then(() => {
		// Set the PublicProduct as the product for the first registered DIN
		return registry.setProduct(DIN, PublicProduct.address)
	}).then(() => {
		return deployer.deploy(DemoToken, DIN, PublicProduct.address) // Deploy token "product"
	}).then(() => {
		return PublicProduct.deployed()
	}).then((instance) => {
		product = instance;
		return product.setPriceResolver(DIN, DemoToken.address).then(() => {
			return product.setInventoryResolver(DIN, DemoToken.address).then(() => {
				// return product.setBuyHandler(DIN, DemoToken.address)
			})
		})
	})

};
