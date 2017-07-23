import React, { Component } from 'react'

import NavigationBar from './NavigationBar'
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
      priceContract: null
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
        const din = result["args"]["DIN"]["c"][0]
        console.log(din)

        // this.state.kioskContract.name({from: this.state.web3.eth.accounts[0]}, din, function(name) {
        //   console.log(name)
        // })

        // this.state.kioskContract.setName({from: this.state.web3.eth.accounts[0]}, din, "Name", function(error, result) {
        //   console.log(error)
        //   console.log(result)
        // })

        // this.state.kioskContract.setPriceResolver({from: this.state.web3.eth.accounts[0]}, din, this.state.priceContract.address, function(error, result) {
        //   console.log(result)
        // })
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
            <input type="text" ref='name' />
          </label>
          <label>
            Image Url:
            <input type="text" ref='imageurl' />
          </label>
          <label>
            Price:
            <input type="text" ref='price' />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Register;
