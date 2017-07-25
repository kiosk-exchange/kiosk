var DINRegistry = artifacts.require('./DINRegistry.sol');
var PublicProduct = artifacts.require('./PublicProduct.sol');

contract('DemoToken', function(accounts) {

	var DIN = 10000001

	// Try to buy the Demo Token using nothing more than its DIN and the address of the DIN Registry
	it("should let an account buy tokens", () => {
		return DINRegistry.deployed().then((instance) => {
			return instance.product(DIN)
		}).then((product) => {
			console.log(product)
		})

	})


	it("should have a DIN registry address", () => {
		return PublicProduct.deployed().then((instance) => {
			return instance.dinRegistry()
		}).then(function(dinRegistry) {
			return DINRegistry.deployed().then((instance) => {
				assert.equal(dinRegistry, instance.address, "The DIN address is not equal to the deployed DIN registry.");
			})
		})
	})


})