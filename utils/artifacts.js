export class Artifacts {
	ENSMarket
	ENS
	DINRegistry
	DINMarket
	PublicMarket
	ENSPublicProduct

	constructor(artifacts) {
		this.ENSMarket = artifacts.require('./ENS/ENSMarket.sol')
		this.ENS = artifacts.require('./ENS/ENS.sol')
		this.DINRegistry = artifacts.require('./DINRegistry.sol')
		this.DINMarket = artifacts.require('./DINMarket.sol')
		this.PublicMarket = artifacts.require('./PublicMarket.sol')
		this.ENSPublicProduct = artifacts.require('./ENSPublicProduct.sol')
	}

}
