var ENSMarket = artifacts.require('./ENS/ENSMarket.sol')
var ENS = artifacts.require('./ENS/ENS.sol')
var DINRegistry = artifacts.require('./DINRegistry.sol')
var DINRegistrar = artifacts.require('./DINRegistrar.sol')
var PublicMarket = artifacts.require('./PublicMarket.sol')
var ENSProduct = artifacts.require('./ENSProduct.sol')

contract('ENSProduct', function(accounts) {

	it("should have a registrar", () => {
		return ENSProduct.deployed().then((instance) => {
			return instance.registrar()
		}).then((registrar) => {
			assert.equal(registrar, DINRegistrar.address, "ENSProduct does not have the correct registrary")
		})
	})

	it("should have a market", () => {
		return ENSProduct.deployed().then((instance) => {
			return instance.market()
		}).then((market) => {
			assert.equal(market, ENSMarket.address, "ENSProduct does not have the correct market")
		})
	})

})

contract('ENSMarket', function(accounts) {

	var account1 = accounts[0];

	it("should have a DIN Registry", () => {
		return ENSMarket.deployed().then((instance) => {
			return instance.dinRegistry()
		}).then((dinRegistry) => {
			assert.equal(dinRegistry, DINRegistry.address, "The ENSMarket DIN registry is not set to the deployed DIN registry")
		})
	})

	it("should have an ENS Registry", () => {
		return ENSMarket.deployed().then((instance) => {
			return instance.ens()
		}).then((ens) => {
			assert.equal(ens, ENS.address, "The ENSMarket ENS registry is not set to the deployed ENS registry")
		})
	})

	it("should set the owner of the ENS Registry top node", () => {
		return ENS.deployed().then((instance) => {
			return instance.owner(0)
		}).then((owner) => {
			assert.equal(owner, account1, "The ENS registry does not have the correct top node owner")
		})
	})

	it("should let sellers add a domain", () => {
		return ENSProduct.deployed().then((instance) => {
			// const price = web3.toWei(1, 'ether')
			return instance.addENS(10000000000000000000, 0)
		// }).then(() => {
		// 	return ENSMarket.totalPrice(10000001, 1)
		// }).then((price) => {
		// 	console.log(price.toNumber())
		})
	})

})