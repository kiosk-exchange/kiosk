var DINRegistry = artifacts.require('./DINRegistry.sol');
var PublicMarket = artifacts.require('./PublicMarket.sol');
var DemoToken = artifacts.require('./DemoToken');

contract('DemoToken', function(accounts) {

	var DIN = 10000001
	var expectedPrice = web3.toWei(.001, 'ether')
	var orderIndex = 0
	var account1 = accounts[0]

	// Try to buy the Demo Token using nothing more than its DIN and the address of the DIN Registry
	it("should be registered in the DIN Registry", () => {
		return DINRegistry.deployed().then((instance) => {
			return instance.market(DIN)
		}).then((market) => {
			assert.equal(market, PublicMarket.address, "The token market is not set to the PublicMarket")
		})
	})

	it("should set the token as price resolver, inventory resolver, and buy handler", () => {
		var market

		return PublicMarket.deployed().then((instance) => {
			market = instance
			return market.priceResolver(DIN)
		}).then((priceResolver) => {
			assert.equal(priceResolver, DemoToken.address, "The token was not set as price resolver")
			return market.inventoryResolver(DIN)
		}).then((inventoryResolver) => {
			assert.equal(inventoryResolver, DemoToken.address, "The token was not set as inventory resolver")
			return market.buyHandler(DIN)
		}).then((buyHandler) => {
			assert.equal(buyHandler, DemoToken.address, "The token was not set as buy handler")
		})
	})

	it("should have the correct price", () => {
		return PublicMarket.deployed().then((instance) => {
			return instance.price(DIN)
		}).then((price) => {
			assert.equal(price.toNumber(), expectedPrice, "The token does not have the correct price")
		})
	})

	it("should not let the user buy the token for free", () => {
		return PublicMarket.deployed().then((instance) => {
			return instance.buy(DIN, 1, { value: 0 })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

	it("should not let the user buy the token for an incorrect price", () => {
		return PublicMarket.deployed().then((instance) => {
			return instance.buy(DIN, 1, { value: 2 * expectedPrice })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

	it("should not let the user buy more tokens than exist in inventory", () => {
		return PublicMarket.deployed().then((instance) => {
			return instance.buy(DIN, 1000000000, { value: expectedPrice })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

	it("should let the user buy the token for the correct price", () => {
		return PublicMarket.deployed().then((instance) => {
			return instance.buy(DIN, 1, { value: expectedPrice })
		})
	})

	it("should increment the public market order index after a purchase", () => {
		var market
		var index

		return PublicMarket.deployed().then((instance) => {
			market = instance
			return market.orderIndex()
		}).then((orderIndex) => {
			index = orderIndex.toNumber()
			return market.buy(DIN, 1, { value: expectedPrice })
		}).then(() => {
			return market.orderIndex()
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
			return PublicMarket.deployed().then((instance) => {
				return instance.buy(DIN, quantity, { value: expectedPrice * quantity })
			}).then(() => {
				return token.balanceOf(account1)
			}).then((balance) => {
				assert.equal(balance.toNumber(), initialBalance + quantity, "The buyer's token balance is incorrect")
			})
		})
	})

	it("should update the token sold amount after a purchase", () => {
		var token
		var initialSold
		var quantity = 10

		return DemoToken.deployed().then((instance) => {
			token = instance
			return token.sold()
		}).then((sold) => {
			initialSold = sold.toNumber()
			return PublicMarket.deployed().then((instance) => {
				return instance.buy(DIN, quantity, { value: expectedPrice * quantity })
			}).then(() => {
				return token.sold()
			}).then((sold) => {
				assert.equal(sold.toNumber(), initialSold + quantity, "The sold amount is incorrect")
			})
		})
	})

	it("should have the correct inventory", () => {
		var token
		var market

		var totalSupply
		var sold

		return DemoToken.deployed().then((instance) => {
			token = instance
			return token.totalSupply()
		}).then((supply) => {
			totalSupply = supply.toNumber()
			return token.sold()
		}).then((tokensSold) => {
			sold = tokensSold.toNumber()
			return PublicMarket.deployed().then((instance) => {
				market = instance
				return market.inStock(DIN, totalSupply - sold)
			}).then((inStock) => {
				assert.equal(inStock, true, "The inventory is incorrect (too low)")
				return market.inStock(DIN, totalSupply - sold + 1)
			}).then((inStock) => {
				assert.equal(inStock, false, "The inventory is incorrect (too high)")
			})
		})
	})

	it("should not let outside addresses call its resolver methods", () => {
		var token

		return DemoToken.deployed().then((instance) => {
			token = instance
			return token.price(DIN, account1)
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
			return token.inventory(DIN)
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
			return token.handleOrder(DIN, 1, account1)
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error")
		})
	})

})