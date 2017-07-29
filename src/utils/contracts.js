import getWeb3 from '../utils/getWeb3'
import publicMarketABI from '../../build/contracts/PublicMarket.json'
import dinRegistrarABI from '../../build/contracts/DINRegistrar.json'
import demoStoreABI from '../../build/contracts/DemoStore.json'

const contract = require('truffle-contract')

let getPublicMarketContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const publicMarket = contract(publicMarketABI)
    publicMarket.setProvider(results.web3.currentProvider)
    publicMarket.deployed().then((instance) => {
      resolve(instance.contract)
    })
  })
})

let getDinRegistrarContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const dinRegistrar = contract(dinRegistrarABI)
    dinRegistrar.setProvider(results.web3.currentProvider)
    dinRegistrar.deployed().then((instance) => {
      resolve(instance.contract)
    })
  })
})

let getDemoStoreContract = new Promise(function(resolve, reject) {
  getWeb3.then(results => {
    const demoStore = contract(demoStoreABI)
    demoStore.setProvider(results.web3.currentProvider)
    demoStore.deployed().then((instance) => {
      resolve(instance.contract)
    })
  })
})

export { getPublicMarketContract, getDinRegistrarContract, getDemoStoreContract }
