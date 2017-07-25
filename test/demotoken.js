var DINRegistry = artifacts.require('./DINRegistry.sol');
var PublicProduct = artifacts.require('./PublicProduct.sol');
var DemoToken = artifacts.require('./DemoToken');

contract('DemoToken', function(accounts) {

	var DIN = 10000001
	var expectedPrice = web3.toWei(.001, 'ether')
	var orderIndex = 0
	var account1 = accounts[0]

	// Try to buy the Demo Token using nothing more than its DIN and the address of the DIN Registry
	it("should be registered in the DIN Registry", () => {
		return DINRegistry.deployed().then((instance) => {
			return instance.product(DIN)
		}).then((product) => {
			assert.equal(product, PublicProduct.address, "The token product is not set to the PublicProduct")
		})
	})

	it("should set the token as price resolver, inventory resolver, and buy handler", () => {
		var product

		return PublicProduct.deployed().then((instance) => {
			product = instance
			return product.priceResolver(DIN)
		}).then((priceResolver) => {
			assert.equal(priceResolver, DemoToken.address, "The token was not set as price resolver")
			return product.inventoryResolver(DIN)
		}).then((inventoryResolver) => {
			assert.equal(inventoryResolver, DemoToken.address, "The token was not set as inventory resolver")
			return product.buyHandler(DIN)
		}).then((buyHandler) => {
			assert.equal(buyHandler, DemoToken.address, "The token was not set as buy handler")
		})
	})

	it("should have the correct price", () => {
		return PublicProduct.deployed().then((instance) => {
			return instance.price(DIN)
		}).then((price) => {
			assert.equal(price.toNumber(), expectedPrice, "The token does not have the correct price")
		})
	})

	it("should not let the user buy the token for free", () => {
		return PublicProduct.deployed().then((instance) => {
			return instance.buy(DIN, 1, { value: 0 })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

	it("should not let the user buy the token for an incorrect price", () => {
		return PublicProduct.deployed().then((instance) => {
			return instance.buy(DIN, 1, { value: 2 * expectedPrice })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

	it("should not let the user buy more tokens than exist in inventory", () => {
		return PublicProduct.deployed().then((instance) => {
			return instance.buy(DIN, 1000000000, { value: expectedPrice })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

	it("should let the user buy the token for the correct price", () => {
		return PublicProduct.deployed().then((instance) => {
			return instance.buy(DIN, 1, { value: expectedPrice })
		})
	})

	it("should increment the public product order index after a purchase", () => {
		var product
		var index

		return PublicProduct.deployed().then((instance) => {
			product = instance
			return product.orderIndex()
		}).then((orderIndex) => {
			index = orderIndex.toNumber()
			return product.buy(DIN, 1, { value: expectedPrice })
		}).then(() => {
			return product.orderIndex()
		}).then((orderIndex) => {
			assert.equal(orderIndex.toNumber(), index + 1, "The order index was not incremented")
		})
	})

	it("should update the buyer's token balance after a purchase", () => {
		var token
		var initialBalance
		var quantity = 10

		return DemoToken.deployed().then((instance) => {
			token = instance
			return token.balanceOf(account1)
		}).then((balance) => {
			initialBalance = balance.toNumber()
			return PublicProduct.deployed().then((instance) => {
				return instance.buy(DIN, quantity, { value: expectedPrice * quantity })
			}).then(() => {
				return token.balanceOf(account1)
			}).then((balance) => {
				assert.equal(balance.toNumber(), initialBalance + quantity, "The buyer's token balance is incorrect")
			})
		})
	})

	it("should update the token inventory after a purchase", () => {
		var token
		var initialSold
		var quantity = 10

		return DemoToken.deployed().then((instance) => {
			token = instance
			return token.sold()
		}).then((sold) => {
			initialSold = sold.toNumber()
			return PublicProduct.deployed().then((instance) => {
				return instance.buy(DIN, quantity, { value: expectedPrice * quantity })
			}).then(() => {
				return token.sold()
			}).then((sold) => {
				assert.equal(sold.toNumber(), initialSold + quantity, "The sold amount is incorrect")
			})
		})
	})

})