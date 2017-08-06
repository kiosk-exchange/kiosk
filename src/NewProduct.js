import React, { Component } from 'react'
import { FormGroup, FormControl } from 'react-bootstrap'

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
    this.props.handleSubmit(event, this.state.name, this.state.price)
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
