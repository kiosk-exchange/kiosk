var DINRegistry = artifacts.require("./DINRegistry.sol");
var PublicProductResolver = artifacts.require("./PublicProductResolver.sol");

contract('DINRegistry', function(accounts) {

	it("should have the correct DIN registry address", function() {
		var registry;
		var resolver;

	  return DINRegistry.deployed().then(function(instance) {
	    registry = instance;
	  }).then(function() {

	  	contract('PublicProductResolver', function(accounts) {

    		return PublicProductResolver.deployed().then(function(instance) {
	    		resolver = instance;
	    		resolver.dinRegistry();
    		}).then(function(dinAddr) {
    			assert.equal(dinAddr, registry.address, "The DIN address is not equal to the deployed DIN registry.")
	    	});
	    });
	  });
	});

});


