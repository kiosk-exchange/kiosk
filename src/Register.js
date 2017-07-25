import React, { Component } from 'react'

import NavigationBar from './Components/NavigationBar'
import getWeb3 from './utils/getWeb3'
import kioskABI from '../build/contracts/KioskResolver.json'
import dinABI from '../build/contracts/DINRegistry.json'
import priceABI from '../build/contracts/PriceResolver.json'
const contract = require('truffle-contract')
// import Product from './Product'

class Register extends Component {
  constructor(props) {
    super(props)

    this.registerProduct = this.registerProduct.bind(this);
    this.state = {
      web3: null,
      kioskContract: null,
      dinContract: null,
      priceContract: null,
      productNameInput: null,
      productImageURLInput: null
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate the resolver contract once web3 provided.
      this.initializeResolvers()
    })
  }

  initializeResolvers() {
    const kioskContract = contract(kioskABI)
    kioskContract.setProvider(this.state.web3.currentProvider)
    kioskContract.deployed().then((instance) => {
      this.setState({ kioskContract: instance.contract })
    })

    const dinContract = contract(dinABI)
    dinContract.setProvider(this.state.web3.currentProvider)
    dinContract.deployed().then((instance) => {
      this.setState({ dinContract: instance.contract })
    })

    const priceResolverContract = contract(priceABI)
    priceResolverContract.setProvider(this.state.web3.currentProvider)
    priceResolverContract.deployed().then((instance) => {
      this.setState({ priceContract: instance.contract })
    })
  }

  registerProduct(e) {
    e.preventDefault()

    var event = this.state.dinContract.NewRegistration({owner: this.state.web3.eth.accounts[0]})
    event.watch((function(error, result) {
      if (!error) {
        const din = parseInt(result["args"]["DIN"]["c"][0])
        console.log(`Created DIN ${din}`)
        this.state.kioskContract.setName(din, this.state.productNameInput.value, {from: this.state.web3.eth.accounts[0]}, () => {
          this.state.kioskContract.setImageURL(din, this.state.productImageURLInput.value,  {from: this.state.web3.eth.accounts[0]}, () => {
            this.state.kioskContract.setPriceResolver(din, this.state.priceContract.address, {from: this.state.web3.eth.accounts[0]})
          })
        })
      } else {
        //TODO: Throw error
      }
      event = null
    }).bind(this))

    this.state.dinContract.registerNewDIN({from: this.state.web3.eth.accounts[0]}, () => {})
  }

  render() {
    return (
      <div>
        <div>
          <NavigationBar className="navigation-bar" />
        </div>
        <form onSubmit={this.registerProduct}>
          <label>
            Name:
            <input type="text" ref={name => this.state.productNameInput = name} />
          </label>
          <label>
            Image Url:
            <input type="text" ref={url => this.state.productImageURLInput = url} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Register;
