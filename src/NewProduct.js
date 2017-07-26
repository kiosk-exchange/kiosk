import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

import getWeb3 from './utils/getWeb3'
import publicProductABI from '../build/contracts/PublicProduct.json'
import dinRegistrarABI from '../build/contracts/DINRegistrar.json'
import demoPriceResolverABI from '../build/contracts/DemoPriceResolver.json'

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
      publicProductContract: null,
      dinRegistrarContract: null,
      demoPriceResolverContract: null,
      name: "",
      imageURL: ""
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleImageURLChange = this.handleImageURLChange.bind(this);
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

    const publicProductContract = contract(publicProductABI)
    publicProductContract.setProvider(this.state.web3.currentProvider)
    publicProductContract.deployed().then((instance) => {
      this.setState({ publicProductContract: instance.contract })
    })

    const dinRegistrarContract = contract(dinRegistrarABI)
    dinRegistrarContract.setProvider(this.state.web3.currentProvider)
    dinRegistrarContract.deployed().then((instance) => {
      this.setState({ dinRegistrarContract: instance.contract })
    })

    const demoPriceResolverContract = contract(demoPriceResolverABI)
    demoPriceResolverContract.setProvider(this.state.web3.currentProvider)
    demoPriceResolverContract.deployed().then((instance) => {
      this.setState({ demoPriceResolverContract: instance.contract })
    })

  }

  // Update state when name label changes
  handleNameChange(event) {
    this.setState({ name: event.target.value })
  }

  // Update state when image URL label changes
  handleImageURLChange(event) {
    this.setState({ imageURL: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    var account1 = this.state.web3.eth.accounts[0]

    var registerEvent = this.state.dinRegistrarContract.NewRegistration({owner: account1})
    registerEvent.watch((error, result) => {
      if (!error) {
        const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)
        console.log(`Created DIN ${DIN}`)
        this.state.publicProductContract.setName(DIN, this.state.name, {from: account1}, () => {
          // Extra gas needed to set long URLs
          this.state.publicProductContract.setImageURL(DIN, this.state.imageURL,  {from: account1, gas: 4700000 }, () => {
            this.state.publicProductContract.setPriceResolver(DIN, this.state.demoPriceResolverContract.address, {from: account1 })
          })
        })
      } else {
        console.log(error)
      }
      registerEvent = null
    })

    this.state.dinRegistrarContract.registerNewDIN({from: account1}, () => {})
  }

  render() {
    return (
      <div>
      
        <div className="form-register">

          <form onSubmit={this.handleSubmit}>
            <FieldGroup
              id="formControlsName"
              type="text"
              label="Product Name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <FieldGroup
              id="formControlsImageURL"
              type="text"
              label="Image URL"
              value={this.state.imageURL}
              onChange={this.handleImageURLChange}
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
