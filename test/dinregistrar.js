var DINRegistry = artifacts.require('./DINRegistry.sol');
var DINRegistrar = artifacts.require('./DINRegistrar.sol');

contract('DINRegistrar', function(accounts) {

	it("should let you set the registrar on the registry", () => {
		var registry
		var registrar

		return DINRegistry.deployed().then((registry) => {
			registry = registry
			return DINRegistrar.deployed().then((registrar) => {
				registrar = registrar
				return registry.owner(10000000).then((owner) => {
					return registry.setRegistrar(registrar.address)
				}).then(() => {
					return registry.registrar()
				}).then((registrarAddr) => {
					assert.equal(registrar.address, registrarAddr, "The registrar address is incorrect")
				})
			})
		})
	})

})

