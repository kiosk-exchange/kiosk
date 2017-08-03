var ENSMarket = artifacts.require('./ENS/ENSMarket.sol')
var ENS = artifacts.require('./ENS/ENS.sol')
var DINRegistry = artifacts.require('./DINRegistry.sol');
var PublicMarket = artifacts.require('./PublicMarket.sol');

contract('ENSMarket', function(accounts) {

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

})