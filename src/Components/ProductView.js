import React, { Component } from 'react'

import Product from '../Product'

import getWeb3 from '../utils/getWeb3'
import { default as TruffleContract } from 'truffle-contract'

import registryABI from '../../build/contracts/DINRegistry.json'
import productABI from '../../build/contracts/PublicProduct.json'

class ProductView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      owner: null,
      name: null,
      imageURL: null,
      price: null,
      formattedPrice: null
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

  initializeRegistry() {
    const registryContract = TruffleContract(registryABI)
    registryContract.setProvider(this.state.web3.currentProvider)

    registryContract.deployed().then((registry) => {

      registry.owner(this.props.din).then((owner) => {
        console.log("Owner: " + owner)

        this.setState({ "owner" : owner })
      })

    })
  }

  initializeResolver() {
    const resolverContract = TruffleContract(productABI)
    resolverContract.setProvider(this.state.web3.currentProvider)

    resolverContract.deployed().then((resolver) => {

      resolver.imageURL(this.props.din).then((imageURL) => {
        console.log("Image: " + imageURL)

        this.setState({ imageURL: imageURL })
      })

      resolver.name(this.props.din).then((name) => {
        console.log("Name: " + name)

        this.setState({ name: name })
      })

      resolver.price(this.props.din).then((price) => {
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
        to: this.state.owner,
        value: this.state.price
      }

      web3.eth.sendTransaction(transaction, (error, result) => {
        console.log(result)
      });
    }
  }

  render() {
    return (
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
    );
  }
}

export default ProductView;
