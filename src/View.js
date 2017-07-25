import React, { Component } from 'react'

import NavigationBar from './NavigationBar'
import getWeb3 from './utils/getWeb3'
import kioskABI from '../build/contracts/KioskResolver.json'
import dinABI from '../build/contracts/DINRegistry.json'
const contract = require('truffle-contract')
// import Product from './Product'

class View extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      kioskContract: null,
      dinContract: null
    }
  }

  componentWillMount() {
    console.log(this.props)
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
  }

  render() {
    return (
      <div>
        <NavigationBar className="navigation-bar" />
        <p>{this.props.params}</p>
      </div>
    );
  }
}

export default View;
