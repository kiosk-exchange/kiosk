import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'

import NavigationBar from './NavigationBar'
import Product from './Product'

import './App.css'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      name: null,
      imageURL: null,
      price: null,
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

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    // Hardcoded for now
    var resolverAddress = "0xb8ab8e1fb64325447d025bd7c08dfd6134b7d11f"
    var productABI = [{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"UPC","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"category","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"price","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"description","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"model","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"imageURL","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"retailURL","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"EAN","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"manufacturer","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"brand","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"color","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}]
    var resolver = this.state.web3.eth.contract(productABI).at(resolverAddress)
    var productID = 10000001;

    resolver.imageURL(productID, (error, imageURL) => {
      this.setState({ imageURL: imageURL })
    });

    resolver.name(productID, (error, name) => {
      this.setState({ name: name })
    });

    // Hardcoded for now
    var price = this.state.web3.toWei(0.1, 'ether')
    this.setState({ price: price })
  }

  buyHandler() {
    if (this.state.price > 0) {
      var web3 = this.state.web3

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
      <div className="App">

        <div>
          <NavigationBar className="navigation-bar" />
        </div>

        <div>
          <Product 
            className="product" 
            imageURL={this.state.imageURL} 
            name={this.state.name}
            buyHandler={this.buyHandler}
          >
          </Product>
        </div>

      </div>

    );
  }
}

export default App;
