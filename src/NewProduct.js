import React, { Component } from 'react'
import FieldGroup from './Components/FieldGroup'

class NewProduct extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: "",
      price: ""
    }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    // let ENSProductContract = this.props.web3.eth.contract({endProductABI.abi})
    // let ENSProduct = ENSProductContract.new(
    //   // Params
    //   {
    //     from: this.props.web3.coinbase,
    //     gas: 4700000
    //   }, function(error, result) {
    //     if (!error) { 
    //       console.log(result.address) 
    //     } else {
    //       console.log(error)
    //     }
    //   }
    // )
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
