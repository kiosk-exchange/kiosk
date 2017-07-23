var DINRegistry = artifacts.require('./DINRegistry.sol');
var KioskResolver = artifacts.require('./KioskResolver.sol');
var PriceResolver = artifacts.require('./PriceResolver.sol');

contract('KioskResolver', function(accounts) {

	var productID = 10000001
	var account1 = accounts[0]
	var price = web3.toWei(0.25, 'ether')

	it("should have a DIN registry address", () => {
		return KioskResolver.deployed().then((instance) => {
			return instance.dinRegistry()
		}).then(function(dinRegistry) {
			return DINRegistry.deployed().then((instance) => {
				assert.equal(dinRegistry, instance.address, "The DIN address is not equal to the deployed DIN registry.");
			})
		})
	})

	it("should have a product name Blue T-Shirt", () => {
		return KioskResolver.deployed().then(function(instance) {
			return instance.name(productID).then(function(name) {
				assert.equal(name, "Blue T-Shirt", "The DIN should have a name set from the migration")
			})
		})
	})

	it("should let the owner of a DIN set product details", () => {
		var registry
		var resolver

		return KioskResolver.deployed().then((instance) => {
			resolver = instance
			return DINRegistry.deployed().then((instance) => {
				registry = instance
				return registry.registerNewDIN()
			}).then(() => {
				return resolver.setName(productID, "Test")
			}).then(() => {
				return resolver.name(productID)
			}).then((name) => {
				assert.equal(name, "Test", "The name was not set correctly")
			})
		})
	})

	it("should have a price resolver for the product", () => {
		var priceResolver;
		return KioskResolver.deployed().then((instance) => {
			return instance.priceResolver(productID).then((priceResolver) => {
				priceResolver = priceResolver
				return PriceResolver.deployed().then((instance) => {
					assert.equal(priceResolver, instance.address, "The price resolver is not correct")
				})
			})
		})
	})

	it("should have a price for the product", () => {
		var resolver
		var expectedPrice = web3.toWei(0.25, 'ether')

		return KioskResolver.deployed().then((instance) => {
			resolver = instance
			return resolver.price(productID)
		}).then((price) => {
			assert.equal(price.toNumber(), expectedPrice, "The price was not set correctly")
		})
	})

	it("should allow you to buy a product for the correct price", () => {
		return KioskResolver.deployed().then((instance) => {
			return instance.buy(productID, {from: account1, value: price})
		})
	})

	// TODO: Test for throw (http://truffleframework.com/tutorials/testing-for-throws-in-solidity-tests)
	it("should not allow you to buy a product for an incorrect price", () => {
			return KioskResolver.deployed().then((instance) => {
				return instance.buy(productID, {from: account1, value: 0})
		})
	})

})


	// Should not let a non-owner change product details
	// Should let any user buy a product
	// Should not accept ether