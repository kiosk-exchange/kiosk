import { Artifacts } from '../utils/artifacts'

const {
	ENSMarket,
	ENS,
	DINRegistry,
	PublicMarket,
	ENSPublicProduct,
	OrderTracker
} = new Artifacts(artifacts)

contract('ENSPublicProduct', function(accounts) {

	it("should have a market", () => {
		return ENSPublicProduct.deployed().then((instance) => {
			return instance.market()
		}).then((market) => {
			assert.equal(market, ENSMarket.address, "ENSProduct does not have the correct market")
		})
	})

})

contract('ENSMarket', function(accounts) {

	const account1 = accounts[0];
	const account2 = accounts[1];
	const DIN = 1000000001
	const price = web3.toWei(2, 'ether')

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
		const quantity = 1
		var ens
			// Transfer ownership of the ENS node to the ENSProduct contract
		ENS.deployed().then((instance) => {
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
		const quantity = 1
		var node
		var market

		return ENSMarket.deployed().then((instance) => {
			// Buy the ENS node
			market = instance
			return market.ENSNode(DIN)
		}).then((ensNode) => {
			node = ensNode
			return market.buy(DIN, 1, {value: price, from: account2})
		}).then(() => {
			return ENS.at(ENS.address).owner(node)
		}).then((owner) => {
			assert.equal(owner, account2, "The ENS node was not transferred to the buyer")
		})
	})

	it("should have funds in escrow for seller", () => {
		const expectedProceeds = web3.toWei(2, 'ether')
		var orderIndex

		// Get the most recent order ID
		return OrderTracker.deployed().then((instance) => {
			return instance.orderIndex()
		}).then((index) => {
			orderIndex = index.toNumber()
			return ENSMarket.deployed()
		}).then((instance) => {
			return instance.pendingWithdrawals(orderIndex)
		}).then((escrow) => {
			assert.equal(escrow.toNumber(), expectedProceeds, "The escrow from the sale is incorrect")
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
		const orderID = 2
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
