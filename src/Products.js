import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router'

import getWeb3 from './utils/getWeb3'

import registrarABI from '../build/contracts/DINRegistrar.json'
const contract = require('truffle-contract')

class Products extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      registrar: null,
      DINs: []
    }

    this.handleAddProduct = this.handleAddProduct.bind(this)
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
      web3: results.web3,
    })

      this.initializeRegistrar()

    })
  }

  initializeRegistrar() {
    const registrar = contract(registrarABI)
    registrar.setProvider(this.state.web3.currentProvider)
    registrar.deployed().then((instance) => {
      this.setState({ registrar: instance.contract }, () => {
        this.getProducts()
      })
    })
  }

  handleAddProduct(event) {
    this.props.history.push('/products/new')
  }

  getProducts() {
    var owner = this.state.web3.eth.coinbase

    var DINs = []

    // Add registration event listener
    var newRegistrationAll = this.state.registrar.NewRegistration({owner: owner}, {fromBlock: 0, toBlock: 'latest'})
    newRegistrationAll.watch((error, result) => {
      if (!error) {

        // Add DINs to array
        const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)
        DINs.push(DIN)

        this.setState({ DINs: DINs })

      } else {
        console.log(error)
      }
    })
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
                  <th>Edit</th>
                </tr>

                {this.state.DINs.map((DIN, index) => (
                    <tr key={index}>
                      <td>
                        <a href={"/DIN/" + DIN}>{DIN}</a>
                      </td>
                      <td>Blue T-Shirt</td>
                      <td>blah</td>
                      <td>
                        <a href={"/product/" + DIN}>Edit</a>
                      </td>
                    </tr>
                  )
                )}

              </tbody>
            </Table>
          </div>

        </div>

      </div>

		);
  }

}

export default Products
