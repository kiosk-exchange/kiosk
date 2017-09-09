const KioskMarketToken = artifacts.require("KioskMarketToken");
const BuyerContract = artifacts.require("Buyer");
const ENSMarket = artifacts.require("ENSMarket");
const ENSRegistry = artifacts.require("ENS");
const FIFSRegistrar = artifacts.require("FIFSRegistrar");
const EtherMarket = artifacts.require("EtherMarket");
const namehash = require("../node_modules/eth-ens-namehash");
const expect = require("chai").expect;

contract("ENSMarket", accounts => {
	
	const seller = accounts[0];
	const buyer = accounts[1];

	// Test domain name
	const DIN = 1000000002;
	const domainName = "example.eth";
	const domainPrice = parseInt(web3.toWei(2, "ether"));
	const domainNode = namehash(domainName);

	// Contracts
	let Market;
	let KMT;
	let Buy;
	let ENS;
	let Registrar;
	let EthMarket;

	before(async () => {
		Market = await ENSMarket.deployed();
		KMT = await KioskMarketToken.deployed();
		Buy = await BuyerContract.deployed();
		ENS = await ENSRegistry.deployed();
		Registrar = await FIFSRegistrar.deployed();
		EthMarket = await EtherMarket.deployed();

		// Exchange 10 ether for KMT
		const amount = web3.toWei(10, "ether");
		await EthMarket.contribute({ from: buyer, value: amount })
	})

	const quantity = 1;

	it("should have the correct product details", async () => {
		const name = await Market.nameOf(DIN);
		const price = await Market.totalPrice(DIN, quantity, buyer);
		const priceInt = price.toNumber();
		const available = await Market.availableForSale(DIN, quantity, buyer);

		expect(name).to.equal(domainName);
		expect(priceInt).to.equal(domainPrice);
		expect(available).to.equal(true);
	});

	it("should have the correct metadata", async () => {
		const metadata = await Market.metadata(DIN);
		// Use ENS namehash function to convert the domain to bytes32 "node"
		expect(metadata).to.equal(domainNode);
	});

	it("should let buyers buy a domain", async () => {
		const beginBalance = await KMT.balanceOf(buyer);
		console.log(beginBalance.toNumber());

		KMT.buy(DIN, 1, domainPrice, { from: buyer, gas: 4700000 });

		console.log(Market.address);

		const owner = await ENS.owner(domainNode);

		expect(owner).to.equal(buyer);
	});

	// It should let buyers buy a domain
	// It should let sellers add a domain
	// It should let sellers withdraw proceeds
});