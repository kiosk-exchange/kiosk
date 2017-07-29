import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

import getWeb3 from './utils/getWeb3'
import publicMarketABI from '../build/contracts/PublicMarket.json'
import dinRegistrarABI from '../build/contracts/DINRegistrar.json'
import demoStoreABI from '../build/contracts/DemoStore.json'

const contract = require('truffle-contract')

function FieldGroup({ id, type, label, placeholder, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

class NewProduct extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      publicMarket: null,
      dinRegistrarContract: null,
      demoStore: null,
      name: "",
      price: ""
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      this.initializeContracts()
    })
  }

  initializeContracts() {

    const publicMarket = contract(publicMarketABI)
    publicMarket.setProvider(this.state.web3.currentProvider)
    publicMarket.deployed().then((instance) => {
      this.setState({ publicMarket: instance.contract })
    })

    const dinRegistrarContract = contract(dinRegistrarABI)
    dinRegistrarContract.setProvider(this.state.web3.currentProvider)
    dinRegistrarContract.deployed().then((instance) => {
      this.setState({ dinRegistrarContract: instance.contract })
    })

    const demoStore = contract(demoStoreABI)
    demoStore.setProvider(this.state.web3.currentProvider)
    demoStore.deployed().then((instance) => {
      this.setState({ demoStore: instance.contract })
    })
  }

  // Update state when name label changes
  handleNameChange(event) {
    this.setState({ name: event.target.value })
  }

  // Update state when image URL label changes
  handlePriceChange(event) {
    this.setState({ price: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    const account1 = this.state.web3.eth.accounts[0]
    const price = this.state.web3.toWei(this.state.price, 'ether')

    this.state.demoStore.addProduct(
      this.state.name, 
      price, 
      {
        from: account1, 
        gas: 4700000
      }, 
      (error, result) => 
    {
      this.props.history.push('/products')
    })
  }

  render() {
    return (
      <div>

        <div className="new-product-form">

          <h1>Add Product</h1>

          <form onSubmit={this.handleSubmit}>
            <FieldGroup
              id="formControlsName"
              type="text"
              label="Product Name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <FieldGroup
              id="formControlsPrice"
              type="text"
              label="Price (ETH)"
              value={this.state.price}
              onChange={this.handlePriceChange}
            />
            <button className="btn-submit-register" type="submit">
              Add Product
            </button>
          </form>

        </div>

      </div>
    );
  }
}

export default NewProduct;
