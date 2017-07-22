var DINRegistry = artifacts.require("./DINRegistry.sol");
var KioskResolver = artifacts.require("./KioskResolver.sol");
var PriceCalculator = artifacts.require("./PriceCalculator.sol");

contract('KioskResolver', function(accounts) {

	it("should have a DIN registry address", () => {
		return KioskResolver.deployed().then((instance) => {
			return instance.dinRegistry();
		}).then(function(dinRegistry) {
			return DINRegistry.deployed().then((instance) => {
				assert.equal(dinRegistry, instance.address, "The DIN address is not equal to the deployed DIN registry.");
			});
		});
	});

	it("should have a product name Blue T-Shirt", () => {

		return KioskResolver.deployed().then(function(instance) {

			return instance.name(10000001).then(function(name) {

				assert.equal(name, "Blue T-Shirt", "The DIN should have a name set from the migration");

			});
		});
	});

	it("should let the owner of a DIN set product details", () => {
		var registry;
		var resolver;
		var expectedPrice = web3.toWei(0.25, 'ether');

		return KioskResolver.deployed().then((instance) => {
			resolver = instance;

			return DINRegistry.deployed().then((instance) => {
				registry = instance;
				return registry.registerNewDIN();

			}).then(() => {
				return resolver.setName(10000001, "Test");
			}).then(() => {
				return resolver.name(10000001);
			}).then((name) => {
				assert.equal(name, "Test", "The name was not set correctly");
			}).then(() => {
				return resolver.price(10000001);
			}).then((price) => {
				assert.equal(price.toNumber(), expectedPrice, "The price was not set correctly");
			});
		});
	});

	// Should not let a non-owner change product details
	// Should let any user buy a product
	// Should not accept ether


});



