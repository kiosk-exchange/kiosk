var DINRegistry = artifacts.require('./DINRegistry.sol');
var DINRegistrar = artifacts.require('./DINRegistrar.sol');
var PublicMarket = artifacts.require('./PublicMarket.sol');
var DemoToken = artifacts.require('./DemoToken.sol');
var DemoPriceResolver = artifacts.require('./DemoPriceResolver.sol');

module.exports = function(deployer) {

	const genesis = 10000000
	const DIN = 10000001
	var registry;
	var registrar;
	var market;

	// Deploy DINRegistry
	deployer.deploy(DINRegistry, genesis).then(() => {
		// Deploy DINRegistrar
		return deployer.deploy(DINRegistrar, DINRegistry.address)
	}).then(() => {
		// Deploy PublicMarket
		return deployer.deploy(PublicMarket, DINRegistry.address)
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
		// Set the PublicMarket as the market for the first registered DIN
		return registry.setProduct(DIN, PublicMarket.address)
	}).then(() => {
		return deployer.deploy(DemoToken, DIN, PublicMarket.address) // Deploy token "product"
	}).then(() => {
		return PublicMarket.deployed()
	}).then((instance) => {
		market = instance;
		return market.setBuyHandler(DIN, DemoToken.address)
	}).then(() => {
		return market.setPriceResolver(DIN, DemoToken.address)
	}).then(() => {
		return market.setInventoryResolver(DIN, DemoToken.address)
	}).then(() => {
		return deployer.deploy(DemoPriceResolver)
	})


};
