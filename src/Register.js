import React, { Component } from 'react'

import NavigationBar from './Components/NavigationBar'

import getWeb3 from './utils/getWeb3'
import publicProductABI from '../build/contracts/PublicProduct.json'
import dinRegistrarABI from '../build/contracts/DINRegistrar.json'
import demoPriceResolverABI from '../build/contracts/DemoPriceResolver.json'

const contract = require('truffle-contract')

class Register extends Component {

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
        <div>
          <NavigationBar className="navigation-bar" />
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.name} onChange={this.handleNameChange} />
          </label>
          <br />
          <label>
            Image Url:
            <input type="text" value={this.state.imageURL} onChange={this.handleImageURLChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Register;
