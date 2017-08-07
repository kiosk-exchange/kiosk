import DINRegistryJSON from '../../build/contracts/DINRegistry.json'
import DINRegistrarJSON from '../../build/contracts/DINRegistrar.json'
import PublicMarketJSON from '../../build/contracts/PublicMarket.json'
import ENSJSON from '../../build/contracts/ENS.json'
import ENSMarketJSON from '../../build/contracts/ENSMarket.json'
import ENSPublicProductJSON from '../../build/contracts/ENSPublicProduct.json'

const contract = require('truffle-contract')

const getContract = (web3, json) => new Promise((resolve, reject) => {
	const aContract = contract(json)
	aContract.setProvider(web3.currentProvider)
	aContract.deployed().then((instance) => {
		resolve(instance.contract)
	})
})

const getDINRegistry = (web3) => { return getContract(web3, DINRegistryJSON) }
const getDINRegistrar = (web3) => { return getContract(web3, DINRegistrarJSON) }
const getPublicMarket = (web3) => { return getContract(web3, PublicMarketJSON) }
const getENS = (web3) => { return getContract(web3, ENSJSON) }
const getENSMarket = (web3) => { return getContract(web3, ENSMarketJSON) }
const getENSProduct = (web3) => { return getContract(web3, ENSPublicProductJSON) }

export { getDINRegistry, getDINRegistrar, getPublicMarket, getENS, getENSMarket, getENSProduct }
