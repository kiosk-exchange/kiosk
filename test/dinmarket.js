const DINMarket = artifacts.require("DINMarket");
const BuyContract = artifacts.require("Buy");
const OrderStoreContract = artifacts.require("OrderStore");
const DINRegistryContract = artifacts.require("DINRegistry");
const chai = require("chai"),
	expect = chai.expect,
	should = chai.should();
const Promise = require("bluebird");

contract("DINMarket", accounts => {
	const buyer = accounts[1];
	const genesis = 1000000000;

	let Buy;
	let OrderStore;
	let DINRegistry;

	before(async () => {
		Buy = await BuyContract.deployed();
		OrderStore = await OrderStoreContract.deployed();
		DINRegistry = await DINRegistryContract.deployed();
	});

	// TODO: Move to utils.
	const getDINFromOrderLog = async buyer => {
		const orderEvent = OrderStore.NewOrder({ buyer: buyer });
		const eventAsync = Promise.promisifyAll(orderEvent);
		const logs = await eventAsync.getAsync();

		// The metadata from the order contains the DIN
		const DINMetadata = logs[0]["args"]["metadata"];
		const DIN = parseInt(DINMetadata);
		return DIN;
	};

	// Buying a DIN should register it on the market
	it("should let a user buy a new DIN", async () => {
		await Buy.buy(genesis, 1, 0, { from: buyer });
		const DIN = await getDINFromOrderLog(buyer);
		should.exist(DIN);
		const owner = await DINRegistry.owner(DIN);
		expect(owner).to.equal(buyer);
	});

});