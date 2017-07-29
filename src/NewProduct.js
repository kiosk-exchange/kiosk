import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import getWeb3 from './utils/getWeb3'
import { getPublicMarketContract, getDinRegistrarContract, getDemoStoreContract } from './utils/contracts'

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
    getPublicMarketContract.then(contract => {
      this.setState({
        publicMarket: contract
      })
    })

    getDinRegistrarContract.then(contract => {
      this.setState({
        dinRegistrarContract: contract
      })
    })


    getDemoStoreContract.then(contract => {
      this.setState({
        demoStore: contract
      })
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
