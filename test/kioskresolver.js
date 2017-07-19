var DINRegistry = artifacts.require("./DINRegistry.sol");
var KioskResolver = artifacts.require("./KioskResolver.sol");

contract('KioskResolver', function(accounts) {

	it("should have a DIN registry address", function() {
		return KioskResolver.deployed().then(function(instance) {
			return instance.dinRegistry();
		}).then(function(dinRegistry) {
			return DINRegistry.deployed().then(function(instance) {
				assert.equal(dinRegistry, instance.address, "The DIN address is not equal to the deployed DIN registry.");
			});
		});
	});

	it("should let the owner of a DIN set product details", function() {
		var registry;
		var resolver;
		var expectedPrice = web3.toWei(1, 'ether');

		return KioskResolver.deployed().then(function(instance) {
			resolver = instance;

			return DINRegistry.deployed().then(function(instance) {
				registry = instance;
				return registry.registerNewDIN();

			}).then(function() {
				return resolver.setName(10000001, "Test");
			}).then(function() {
				return resolver.name(10000001);
			}).then(function(name) {
				assert.equal(name, "Test", "The name was not set correctly");

			}).then(function() {
				return resolver.setPrice(10000001, expectedPrice);
			}).then(function() {
				return resolver.price(10000001);
			}).then(function(price) {
				assert.equal(price, expectedPrice, "The price was not set correctly");
			});
		});
	});

	// Should not let a non-owner change product details
	// Should let any user buy a product
	// Should not accept ether


});



