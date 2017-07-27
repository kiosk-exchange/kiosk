import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import getWeb3 from './utils/getWeb3'

class Products extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      publicProduct: null
    }

    this.handleAddProduct = this.handleAddProduct.bind(this)
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
      web3: results.web3,
    })

    })
  }

  handleAddProduct(event) {
    this.props.history.push('/products/new')
  }

  render() {
    return (
      <div>

        <div className="container-products-table">

          <div className="container-products-header">
            <h1 className="products-header">Products</h1>
            <button className="add-product-button" onClick={this.handleAddProduct}>
            Add Product
            </button>
          </div>

          <div className="products-table">
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <th>DIN</th>
                  <th>Name</th>
                  <th>Image</th>
                </tr>

                <tr>
                  <td>1000-0001</td>
                  <td>Blue T-Shirt</td>
                  <td>blah</td>
                </tr>
              </tbody>
            </Table>
          </div>

        </div>

      </div>

		);
  }

}

export default Products
