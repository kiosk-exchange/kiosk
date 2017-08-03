var ENS = artifacts.require('./ENS/ENS.sol')
var ENSMarket = artifacts.require('./ENS/ENSMarket.sol')
var DINRegistry = artifacts.require('./DINRegistry.sol')

module.exports = function(deployer) {

	var genesis = 10000000

	deployer.deploy(ENS).then(() => {
		deployer.deploy(DINRegistry, genesis)
	}).then(() => {
		deployer.deploy(ENSMarket, DINRegistry.address, ENS.address)
	})

}