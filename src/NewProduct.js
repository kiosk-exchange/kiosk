import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

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
          <h1>{this.props.title}</h1>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <label>Name</label>
              <FormControl type="text" placeholder={this.props.namePlaceholder} value={this.state.name} onChange={this.handleNameChange} />
            </FormGroup>
            <FormGroup>
              <label>Price (in ether)</label>
              <FormControl type="text" value={this.state.price} onChange={this.handlePriceChange} />
            </FormGroup>
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
