var DINRegistry = artifacts.require('./DINRegistry.sol')
var DINRegistrar = artifacts.require('./DINRegistrar.sol')
var PublicMarket = artifacts.require('./PublicMarket.sol')
var DemoToken = artifacts.require('./DemoToken.sol')
var DemoStore = artifacts.require('./DemoStore.sol')

module.exports = function(deployer) {

	const genesis = 10000000
	const DIN = 10000001
	var registry
	var registrar
	var market
	var store

	// // Deploy DINRegistry
	// deployer.deploy(DINRegistry, genesis).then(() => {
	// 	// Deploy DINRegistrar
	// 	return deployer.deploy(DINRegistrar, DINRegistry.address)
	// }).then(() => {
	// 	// Deploy PublicMarket
	// 	return deployer.deploy(PublicMarket, DINRegistry.address)
	// }).then(() => {
	// 	return DINRegistry.deployed()
	// }).then((instance) => {
	// 	// Set the registrar on the DINRegistry
	// 	registry = instance
	// 	return registry.setRegistrar(DINRegistrar.address)
	// }).then(() => {
	// 	return DINRegistrar.deployed()
	// }).then((instance) => {
	// 	registrar = instance
	// 	return registrar.registerNewDIN(); // Register 10000001
	// }).then(() => {
	// 	// Set the PublicMarket as the market for the first registered DIN
	// 	return registry.setMarket(DIN, PublicMarket.address)
	// }).then(() => {
	// 	return deployer.deploy(DemoToken, DIN, PublicMarket.address) // Deploy token "product"
	// }).then(() => {
	// 	return PublicMarket.deployed()
	// }).then((instance) => {
	// 	market = instance;
	// 	var token = DemoToken.address
	// 	// Add the token as a product on the PublicMarket. Its product info, inventory, price, and buy handler are all in the token contract.
	// 	market.addProduct(DIN, token, token, token, token)
	// }).then(() => {
	// 	return deployer.deploy(DemoStore, DINRegistrar.address, PublicMarket.address)
	// }).then(() => {
	// 	return DemoStore.deployed()
	// }).then((instance) => {
	// 	store = instance;

	// 	const names = ["iPhone", "iPad", "Apple Watch"]
	// 	const prices = [500000000000000000, 1000000000000000000, 2000000000000000000]

	// 	return store.addProduct(names[0], prices[0]).then(() => {
	// 		return store.addProduct(names[1], prices[1]).then(() => {
	// 			return store.addProduct(names[2], prices[2])
	// 		})
	// 	})
	// })

}
