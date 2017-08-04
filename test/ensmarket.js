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
	var account2 = accounts[1];

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
		const DIN = 10000001
		const quantity = 1
		const price = web3.toWei(2, 'ether')
		var ens

		return ENSProduct.deployed().then((instance) => {
			// 1) Add the ENS node information and price to the ENSProduct contract
			return instance.addENS(price, 0)
		}).then(() => {
			// 2) Transfer ownership of the ENS node to the ENSProduct contract
			return ENS.deployed()
		}).then((instance) => {
			ens = instance
			return ens.setOwner(0, ENSProduct.address)
		}).then(() => {
			return ens.owner(0)
		}).then((owner) => {
			assert.equal(owner, ENSProduct.address, "The ENS node was not transferred to ENSProduct")
			return ENSMarket.deployed()
		}).then((instance) => {
			return instance.totalPrice(DIN, quantity)
		}).then((domainPrice) => {
			assert.equal(domainPrice.toNumber(), price, "The price of the ENS node is incorrect")
		})
	})

	it("should only allow ENS node products that are owned by their buy handler", () => {
		const DIN = 10000001
		var market
		var ensNode
		var ensOwner

		return ENSMarket.deployed().then((instance) => {
			market = instance
			return market.ENSNode(DIN)
		}).then((node) => {
			ensNode = node
			return ENS.deployed()
		}).then((instance) => {
			return instance.owner(ensNode)
		}).then((owner) => {
			ensOwner = owner
			return market.buyHandler(DIN)
		}).then((buyHandler) => {
			assert.equal(ensOwner, buyHandler)
		})

	})

	it("should let buyers buy a domain", () => {
		const price = web3.toWei(2, 'ether')
		const DIN = 10000001
		const quantity = 1

		return ENSMarket.deployed().then((instance) => {
			// Buy the ENS node
			return instance.buy(DIN, 1, { from: account2, value: price })
		}).then(() => {
			return ENS.deployed()
		}).then((instance) => {
			return instance.owner(0)
		}).then((owner) => {
			assert.equal(owner, account2, "The ENS node was not transferred to the buyer")
		})
	})

	it("should have funds in escrow for seller", () => {
		const expectedProceeds = web3.toWei(2, 'ether')
		const orderID = 1

		return ENSMarket.deployed().then((instance) => {
			return instance.availableForWithdrawal(1)
		}).then((escrow) => {
			assert.equal(escrow, expectedProceeds, "The escrow from the sale is incorrect")
		})
	})

	it("should not let a random account withdraw", () => {
		const orderID = 1

		return ENSMarket.deployed().then((instance) => {
			return instance.withdraw(orderID, { from: account2 })
		}).then().catch((error) => {
			assert.isDefined(error, "There was no error for withdrawing with a random account")
		})

	})

	it("should increase the seller's balance after withdrawing", () => {
		const beginBalance = web3.fromWei(web3.eth.getBalance(account1), 'ether').toNumber()
		const orderID = 1
		const expectedProceeds = 2
		const gasAllowance = 0.1

		return ENSMarket.deployed().then((instance) => {
			return instance.withdraw(orderID, { from: account1 })
		}).then(() => {
			const endBalance = web3.fromWei(web3.eth.getBalance(account1), 'ether').toNumber()
			assert.isAtLeast(endBalance, beginBalance + expectedProceeds - gasAllowance, "Withdrawing proceeds from sale did not work")
		})
	})

})