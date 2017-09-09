const ENSMarket = artifacts.require("ENSMarket");
const FIFSRegistrar = artifacts.require("FIFSRegistrar");
const namehash = require("../node_modules/eth-ens-namehash");
const expect = require("chai").expect;

contract("ENSMarket", accounts => {

	const account1 = accounts[0];

	// Test domain name
	const DIN = 1000000002;
	const domainName = "example.eth"
	const domainPrice = parseInt(web3.toWei(2, "ether"));

	const quantity = 1;

	it("should have the correct product details", async () => {
		const market = await ENSMarket.deployed();
		const name = await market.nameOf(DIN);
		const price = await market.totalPrice(DIN, quantity, account1);
		const priceInt = price.toNumber();
		const available = await market.availableForSale(DIN, quantity, account1);

		expect(name).to.equal(domainName);
		expect(priceInt).to.equal(domainPrice);
		expect(available).to.equal(true);
	})

	it("should have the correct metadata", async () => {
		const market = await ENSMarket.deployed();
		const metadata = await market.metadata(DIN);

		// Use ENS namehash function to convert the domain to bytes32 "node"
		const domainNode = namehash(domainName);

		expect(metadata).to.equal(domainNode)
	})

	it("should let buyers buy a domain", () => {

	})

	// It should let buyers buy a domain
	// It should let sellers add a domain
	// It should let sellers withdraw proceeds

})