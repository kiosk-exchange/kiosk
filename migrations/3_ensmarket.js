var DINRegistry = artifacts.require('./DINRegistry.sol')
var ENS = artifacts.require('./ENS/ENS.sol')
var ENSMarket = artifacts.require('./ENS/ENSMarket.sol')

module.exports = function(deployer) {

	const genesis = 10000000

	deployer.deploy(ENS).then(() => {
		return deployer.deploy(DINRegistry, genesis)
	}).then(() => {
		return deployer.deploy(ENSMarket, DINRegistry.address, ENS.address)
	})

}