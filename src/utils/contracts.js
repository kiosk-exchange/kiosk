import publicMarketABI from '../../build/contracts/PublicMarket.json'
import dinRegistrarABI from '../../build/contracts/DINRegistrar.json'
import demoStoreABI from '../../build/contracts/DemoStore.json'
import registryABI from '../../build/contracts/DINRegistry.json'
import productInfoABI from '../../build/contracts/ProductInfo.json'
import priceResolverABI from '../../build/contracts/PriceResolver.json'
import ensABI from '../../build/contracts/ENS.json'
import ensMarketABI from '../../build/contracts/ENSMarket.json'
import ensProductABI from '../../build/contracts/ENSProduct.json'
const contract = require('truffle-contract')

let dinRegistry = new Promise(function(resolve, reject) {
  
}

function getDINRegistry(web3) {
  return getContract(web3, registryABI)
}

function getDINRegistrar(web3) {
  return getContract(web3, dinRegistrarABI)
}

function getPublicMarket(web3) {
  return getContract(web3, publicMarketABI)
}

function getENS(web3) {
  return getContract(web3, ensABI)
}

function getENSMarket(web3) {
  return getContract(web3, ensMarketABI)
}

function getENSProduct(web3) {
  return getContract(web3, ensProductABI)
}

function getContract(web3, abi) {
  const aContract = contract(abi)
  aContract.setProvider(web3.currentProvider)
  return aContract.deployed()
}

export { getDINRegistry, getDINRegistrar, getPublicMarket, getENS, getENSMarket, getENSProduct }
