const TestRegistrar = artifacts.require("TestRegistrar");
const OrderStore = artifacts.require("OrderStore");
const BuyContract = artifacts.require("Buy");
const ENSMarket = artifacts.require("ENSMarket");
const ENSContract = artifacts.require("ENS");
const DINRegistry = artifacts.require("DINRegistry");
const namehash = require("../node_modules/eth-ens-namehash");
var Promise = require("bluebird");

// Pass in "example" to register "example.eth"
const addDomain = async (domain, priceInKMT, buyer) => {
		// Register the domain on the test registrar
	const registrar = await TestRegistrar.deployed();
	const subdomain = web3.sha3(domain);
	const result = await registrar.register(subdomain, buyer, { from: buyer });

	// Buy a DIN
	const buy = await BuyContract.deployed();
	await buy.buyDIN();

	const orders = await OrderStore.deployed();
	const orderEvent = orders.NewOrder({ buyer: buyer });
	const eventAsync = Promise.promisifyAll(orderEvent);
	const logs = await eventAsync.getAsync();

	// The metadata from the order contains the DIN
	const DINMetadata = logs[0]["args"]["metadata"];
	const DIN = parseInt(DINMetadata);
	console.log(DIN);

	const market = await ENSMarket.deployed();

	const domainName = domain + ".eth";
	const domainNode = namehash(domainName);
	const price = priceInKMT * 10**18;
	const available = true;

	// Add the domain to the market
	await market.setDomain(DIN, domainName, domainNode, price, available, { from: buyer });

	// Transfer ownership of the domain to the market
	const ens = await ENSContract.deployed();
	await ens.setOwner(subdomain, market.address, { from: buyer });

	// Set the market on DINRegistry
	const registry = await DINRegistry.deployed();
	await registry.setMarket(DIN, market.address, { from: buyer })
};

module.exports = async callback => {
	const account = process.argv[4];
	const price = process.argv[5];
	const domain = process.argv[6];

	await addDomain(domain, price, account);

	process.exit();

};