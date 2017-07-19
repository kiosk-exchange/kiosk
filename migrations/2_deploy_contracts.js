var DINRegistry = artifacts.require("./DINRegistry.sol");
var KioskResolver = artifacts.require("./KioskResolver.sol");
var KioskOrderTracker = artifacts.require("./KioskOrderTracker.sol");

module.exports = function(deployer) {

	// Initialize the DIN Registry contract with a genesis number.
	deployer.deploy(DINRegistry, 10000000).then(function() {

		return deployer.deploy(KioskOrderTracker).then(function() {

			// Deploy the Kiosk Resolver with a reference to the DIN Registry and Order Tracker.
			return deployer.deploy(KioskResolver, DINRegistry.address, KioskOrderTracker.address);

		});
	});

};
