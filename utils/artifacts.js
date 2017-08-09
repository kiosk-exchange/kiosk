export class Artifacts {
	ENSMarket
	ENS
	DINRegistry
	DINRegistrar
	PublicMarket
	ENSPublicProduct

	constructor(artifacts) {
		this.ENSMarket = artifacts.require('./ENS/ENSMarket.sol')
		this.ENS = artifacts.require('./ENS/ENS.sol')
		this.DINRegistry = artifacts.require('./DINRegistry.sol')
		this.DINRegistrar = artifacts.require('./DINRegistrar.sol')
		this.PublicMarket = artifacts.require('./PublicMarket.sol')
		this.ENSProduct = artifacts.require('./ENSPublicProduct.sol')
	}

}