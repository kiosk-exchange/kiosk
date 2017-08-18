import DINRegistryJSON from '../../build/contracts/DINRegistry.json'
import DINMarketJSON from '../../build/contracts/DINMarket.json'
import PublicMarketJSON from '../../build/contracts/PublicMarket.json'
import ENSJSON from '../../build/contracts/ENS.json'
import ENSMarketJSON from '../../build/contracts/ENSMarket.json'
import ENSPublicProductJSON from '../../build/contracts/ENSPublicProduct.json'
import OrderTrackerJSON from '../../build/contracts/OrderTracker.json'
import KioskMarketTokenJSON from '../../build/contracts/KioskMarketToken.json'

const contract = require('truffle-contract')

const getContract = (web3, json) => new Promise((resolve, reject) => {
	const aContract = contract(json)
	aContract.setProvider(web3.currentProvider)
	aContract.deployed().then((instance) => {
		resolve(instance.contract)
	})
})

const getDINRegistry = (web3) => { return getContract(web3, DINRegistryJSON) }
const getKioskMarketToken = (web3) => { return getContract(web3, KioskMarketTokenJSON )}
const getDINMarket = (web3) => { return getContract(web3, DINMarketJSON) }
const getPublicMarket = (web3) => { return getContract(web3, PublicMarketJSON) }
const getENS = (web3) => { return getContract(web3, ENSJSON) }
const getENSMarket = (web3) => { return getContract(web3, ENSMarketJSON) }
const getENSPublicProduct = (web3) => { return getContract(web3, ENSPublicProductJSON) }
const getOrderTracker = (web3) => { return getContract(web3, OrderTrackerJSON) }

export { getDINRegistry, getDINMarket, getPublicMarket, getENS, getENSMarket, getENSPublicProduct, getOrderTracker, getKioskMarketToken }
