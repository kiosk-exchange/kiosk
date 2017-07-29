import React, { Component } from 'react'

import getWeb3 from '../utils/getWeb3'
import { default as TruffleContract } from 'truffle-contract'

import registryABI from '../../build/contracts/DINRegistry.json'
import publicMarketABI from '../../build/contracts/PublicMarket.json'

class FeaturedProducts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null
    }

    this.buyHandler = this.buyHandler.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Initialize the registry and resolver contracts once web3 provided.
      this.initializeRegistry()
      this.initializeResolver()
    })
  }

  render() {
    return (

  }
}

export default ProductView;
