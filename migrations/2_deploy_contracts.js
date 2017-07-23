var DINRegistry = artifacts.require("./DINRegistry.sol");
var KioskResolver = artifacts.require("./KioskResolver.sol");
var PriceResolver = artifacts.require("./PriceResolver.sol");

module.exports = function(deployer) {

	const genesis = 10000000

	// Initialize the DIN Registry contract with a genesis number of 1000-0000.
	deployer.deploy(DINRegistry, genesis).then(() => {
			// Deploy the Kiosk Resolver with a reference to the DIN Registry
			return deployer.deploy(KioskResolver, DINRegistry.address)
		}).then(() => {
			return DINRegistry.deployed()
		}).then((registry) => {
			// Register DIN 1000-0001.
			return registry.registerNewDIN()
		}).then(() => {
			return deployer.deploy(PriceResolver)
		}).then(() => {
			return KioskResolver.deployed()
		}).then((resolver) => {
				const productID = genesis + 1
				return resolver.setPriceResolver(productID, PriceResolver.address).then(() => {
					return resolver.setName(productID, "Blue T-Shirt").then(() => {
						return resolver.setImageURL(productID, "https://vangogh.teespring.com/v3/image/CNR5jCc39PoWcclKu2kJxvzdvRk/480/560.jpg");
			});
		});
	});
};
