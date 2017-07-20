import React, { Component } from 'react'

import NavigationBar from './NavigationBar'
import Product from './Product'

import getWeb3 from './utils/getWeb3'
import resolverABI from '../build/contracts/KioskResolver.json'

import './Home.css'

// Hardcoded to first registered product
var productID = 10000001;

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      name: null,
      imageURL: null,
      price: null,
      formattedPrice: null,
      tokens: 5
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

      // Instantiate the resolver contract once web3 provided.
      this.initializeResolver()

    })

  }

  initializeResolver() {
    const contract = require('truffle-contract')

    const resolverContract = contract(resolverABI)
    resolverContract.setProvider(this.state.web3.currentProvider)

    resolverContract.deployed().then((resolver) => {

      resolver.imageURL(productID).then((imageURL) => {
        console.log("Image: " + imageURL)

        this.setState({ imageURL: imageURL })
      })

      resolver.name(productID).then((name) => {
        console.log("Name: " + name)

        this.setState({ name: name })
      })

      resolver.price(productID).then((price) => {
        console.log("Price: " + price + " wei")

        this.setState({ price: price })

        let formattedPrice = this.state.web3.fromWei(price, 'ether') + " ether"
        this.setState({ formattedPrice: formattedPrice })
      })

    })

  }

  buyHandler() {
    if (this.state.price > 0) {
      var web3 = this.state.web3

      // Hardcoded for now
      var transaction = {
        from: web3.eth.coinbase,
        to: "0x308Dd21BDf208C5352ab1088cC544FF8b44f299a",
        value: this.state.price
      }

      web3.eth.sendTransaction(transaction, (error, result) => {
        console.log(result)
      });
    }
  }

  render() {
    return (
      <div className="Home">

        <div>
          <NavigationBar className="navigation-bar" />
        </div>

        <div>
          <Product 
            className="product" 
            imageURL={this.state.imageURL} 
            name={this.state.name}
            price={this.state.formattedPrice}
            buyHandler={this.buyHandler}
          >
          </Product>
        </div>

      </div>

    );
  }
}

export default Home;
