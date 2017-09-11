const KioskMarketTokenContract = artifacts.require("KioskMarketToken");
const DINRegistryContract = artifacts.require("DINRegistry");
const BuyContract = artifacts.require("Buy");
const OrderStoreContract = artifacts.require("OrderStore");
const ENSMarketContract = artifacts.require("ENSMarket");
const ENSContract = artifacts.require("ENS");
const TestRegistrarContract = artifacts.require("TestRegistrar");
const EtherMarketContract = artifacts.require("EtherMarket");
const namehash = require("../node_modules/eth-ens-namehash");
const chai = require("chai"),
	expect = chai.expect,
	should = chai.should();
const Promise = require("bluebird");

contract("ENSMarket", accounts => {
	// Use the second account because the first was used in deployment
	const Alice = accounts[1]; // Seller
	const Bob = accounts[2]; // Buyer
	const genesis = 1000000000;
	const quantity = 1;

	// Contracts
	let ENSMarket;
	let KMT;
	let DINRegistry;
	let Buy;
	let Orders;
	let ENS;
	let TestRegistrar;
	let EtherMarket;

	before(async () => {
		ENSMarket = await ENSMarketContract.deployed();
		KMT = await KioskMarketTokenContract.deployed();
		DINRegistry = await DINRegistryContract.deployed();
		Buy = await BuyContract.deployed();
		Orders = await OrderStoreContract.deployed();
		ENS = await ENSContract.deployed();
		TestRegistrar = await TestRegistrarContract.deployed();
		EtherMarket = await EtherMarketContract.deployed();

		// Exchange 1 ether for KMT
		const amount = web3.toWei(1, "ether");
		await EtherMarket.contribute({ from: Bob, value: amount });
	});

	const aliceDomainName = "alice.eth";
	const alicePrice = web3.toWei(0.1, "ether"); // (in KMT)
	const aliceSubdomain = web3.sha3("alice");
	const aliceDomainNode = namehash(aliceDomainName);
	let aliceDIN;

	const getDINFromOrderLog = async () => {
		const orderEvent = Orders.NewOrder({ buyer: Alice });
		const eventAsync = Promise.promisifyAll(orderEvent);
		const logs = await eventAsync.getAsync();

		// The metadata from the order contains the DIN
		const DINMetadata = logs[0]["args"]["metadata"];
		aliceDIN = parseInt(DINMetadata);
	};

	const addDomainToENSMarket = async () => {
		await ENSMarket.setDomain(
			aliceDIN,
			aliceDomainName,
			aliceDomainNode,
			alicePrice,
			true,
			{ from: Alice }
		);
	};

	const domainAvailable = async () => {
		const available = await ENSMarket.availableForSale(
			aliceDIN,
			quantity,
			Bob
		);
		return available;
	}

	it("should let sellers sell a domain", async () => {
		// Alice wants to register and sell "alice.eth"

		// Step 1. Register alice.eth on the deployed ENS Registrar (TestRegistrar)
		await TestRegistrar.register(aliceSubdomain, Alice, {
			from: Alice
		});

		const owner = await ENS.owner(aliceDomainNode);
		expect(owner).to.equal(Alice);

		// Step 2. Get a DIN that will uniquely identify the product on Kiosk

		// Buy a DIN
		const result = await Buy.buy(genesis, 1, 0, {
			from: Alice
		});

		// From the event logs, get Alice's DIN
		await getDINFromOrderLog();

		// Step 3. Add product information for "alice.eth" to ENSMarket
		await addDomainToENSMarket();

		const name = await ENSMarket.nameOf(aliceDIN);
		// Bob is a random third-party at this point (for price and availability)
		const price = await ENSMarket.totalPrice(aliceDIN, quantity, Bob);
		const priceInt = price.toNumber();

		const available = await domainAvailable();
		const metadata = await ENSMarket.metadata(aliceDIN);

		expect(name).to.equal(aliceDomainName);
		expect(priceInt).to.equal(parseInt(alicePrice));
		// Alice hasn't transferred ownership of the domain yet, so it should not be available
		expect(available).to.equal(false);
		expect(metadata).to.equal(aliceDomainNode);

		// Step 4. Transfer ownership of "alice.eth" to ENSMarket
		await ENS.setOwner(aliceDomainNode, ENSMarket.address, { from: Alice });
		const nowAvailable = await domainAvailable();
		const newOwner = await ENS.owner(aliceDomainNode);
		expect(newOwner).to.equal(ENSMarket.address);
		expect(nowAvailable).to.equal(true);

		// Step 5. Update the DINRegistry to point Alice's DIN to ENSMarket
		await DINRegistry.setMarket(aliceDIN, ENSMarket.address, { from: Alice })
	});

	it("should let buyers buy a domain", async () => {
		await Buy.buy(aliceDIN, quantity, alicePrice, { from: Bob });
		const newOwner = await ENS.owner(aliceDomainNode);
		expect(newOwner).to.equal(Bob);
	});

	it("should let sellers withdraw proceeds", async () => {
		const beginBalance = await KMT.balanceOf(Alice);
		expect(beginBalance.toNumber()).to.equal(0);
		await ENSMarket.withdraw({ from: Alice });
		const endBalance = await KMT.balanceOf(Alice);
		expect(endBalance.toNumber()).to.equal(parseInt(alicePrice));
	})

});