import getWeb3 from '../utils/getWeb3'
import publicMarketABI from '../../build/contracts/PublicMarket.json'
import dinRegistrarABI from '../../build/contracts/DINRegistrar.json'
import demoStoreABI from '../../build/contracts/DemoStore.json'
import registryABI from '../../build/contracts/DINRegistry.json'
import productInfoABI from '../../build/contracts/ProductInfo.json'
import priceResolverABI from '../../build/contracts/PriceResolver.json'

const contract = require('truffle-contract')

// let getPriceResolverContract = new Promise(function(resolve, reject) {
//   getWeb3.then(results => {
//     const priceResolv = contract(priceResolverABI)
//     priceResolv.setProvider(results.web3.currentProvider)
//     priceResolv.deployed().then((instance) => {
//       resolve(instance)
//     })
//   })
// })

// let getProductInfoContract = new Promise(function(resolve, reject) {
//   getWeb3.then(results => {
//     const prodInfo = contract(productInfoABI)
//     prodInfo.setProvider(results.web3.currentProvider)
//     prodInfo.deployed().then((instance) => {
//       resolve(instance)
//     })
//   })
// })

let getDINRegistryContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const registry = contract(registryABI)
    registry.setProvider(results.web3.currentProvider)
    registry.deployed().then((instance) => {
      resolve(instance)
    })
  })
})

let getPublicMarketContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const publicMarket = contract(publicMarketABI)
    publicMarket.setProvider(results.web3.currentProvider)
    publicMarket.deployed().then((instance) => {
      resolve(instance)
    })
  })
})

let getDinRegistrarContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const dinRegistrar = contract(dinRegistrarABI)
    dinRegistrar.setProvider(results.web3.currentProvider)
    dinRegistrar.deployed().then((instance) => {
      resolve(instance)
    })
  })
})

let getDemoStoreContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const demoStore = contract(demoStoreABI)
    demoStore.setProvider(results.web3.currentProvider)
    demoStore.deployed().then((instance) => {
      resolve(instance)
    })
  })
})

export { getPublicMarketContract, getDinRegistrarContract, getDemoStoreContract, getDINRegistryContract }
