import React, { Component } from 'react'

import NavigationBar from './NavigationBar'
import Product from './Product'
import getWeb3 from './utils/getWeb3'
import kioskABI from '../build/contracts/KioskResolver.json'
import dinABI from '../build/contracts/DINRegistry.json'


// Hardcoded to first registered product
var productID = 10000001;

class Register extends Component {
  constructor(props) {
    super(props)

    this.registerProduct = this.registerProduct.bind(this);

    this.state = {
      kioskContract: null,
      dinContract: null
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
    const contract = require('truffle-contract')

    const kioskContract = contract(kioskABI)
    kioskContract.setProvider(this.state.web3.currentProvider)
    this.setState({
      kioskContract: kioskContract
    })

    const dinContract = contract(dinABI)
    dinContract.setProvider(this.state.web3.currentProvider)
    this.setState({
      dinContract: dinContract
    })
  }

  registerProduct(e) {

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

// return resolver.setName(productID, "Blue T-Shirt").then(() => {
//   return resolver.setPrice(productID, 10000000000000).then(() => {
//     return resolver.setImageURL(productID, "https://vangogh.teespring.com/v3/image/CNR5jCc39PoWcclKu2kJxvzdvRk/480/560.jpg");
//
//   });
// });
