const DINRegistry = artifacts.require("DINRegistry");
const DINMarket = artifacts.require("DIN/DINMarket");
const OrderTracker = artifacts.require("OrderTracker");
const KioskMarketToken = artifacts.require("KioskMarketToken");

require("chai").should();

contract("DINRegistry", function(accounts) {
	const totalSupply = 5000;
	const genesis = 1000000000;
	var registry; // The global DIN Registry
	var dinMarket;

	beforeEach(async () => {
		// Create a new Kiosk Market Token
		const KMT = await KioskMarketToken.new(totalSupply);

		// Create a new DIN Registry
		this.registry = await DINRegistry.new(genesis);

		// Create a new Order Tracker
		const orderTracker = await OrderTracker.new(
			this.registry.address,
			KMT.address
		);

		await KMT.setDINRegistry(this.registry.address);
		await KMT.setOrderTracker(orderTracker.address);

		// Create a new DIN Market
		this.dinMarket = await DINMarket.new(
			this.registry.address,
			orderTracker.address,
			KMT.address
		);

		const market1 = await this.registry.market(genesis);
		console.log(market1);

		await this.registry.setMarket(genesis, this.dinMarket.address);
		await KMT.buy(genesis, 1, 0);
	});

	// Register a new DIN.

	it("should set the owner correctly", async () => {});

	it("should set the market correctly", () => {
		//
	});
});