var DINRegistry = artifacts.require("./DINRegistry.sol");
var KioskResolver = artifacts.require("./KioskResolver.sol");
var KioskOrderTracker = artifacts.require("./KioskOrderTracker.sol");

module.exports = function(deployer) {

	const genesis = 10000000

	// Initialize the DIN Registry contract with a genesis number of 1000-0000.
	deployer.deploy(DINRegistry, genesis).then(() => {
			// Deploy the Kiosk Resolver with a reference to the DIN Registry
			return deployer.deploy(KioskResolver, DINRegistry.address).then(() => {

				return DINRegistry.deployed().then((registry) => {
					// Register DIN 1000-0001.
					return registry.registerNewDIN().then(() => {

						return KioskResolver.deployed().then((resolver) => {

							const productID = genesis + 1
							const price = 20000000000000000

							return resolver.setName(productID, "Blue T-Shirt").then(() => {
								return resolver.setPrice(productID, price).then(() => {
									return resolver.setImageURL(productID, "https://vangogh.teespring.com/v3/image/CNR5jCc39PoWcclKu2kJxvzdvRk/480/560.jpg");

							});
						});
					});
				});
			});
		});
	});
};
