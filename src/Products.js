import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import getWeb3 from './utils/getWeb3'
import { getDinRegistrarContract, getPublicMarketContract, getProductInfoContract, getPriceResolverContract } from './utils/contracts'
import productInfoABI from '../build/contracts/ProductInfo.json'
import priceResolverABI from '../build/contracts/PriceResolver.json'

class Products extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      registrar: null,
      publicMarket: null,
      products: []
    }

    this.handleAddProduct = this.handleAddProduct.bind(this)
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
      web3: results.web3,
    })

      this.initializeContracts()
    })
  }

  initializeContracts() {
    getDinRegistrarContract.then(result => {
      this.setState({
        registrar: result.contract
      }, () => {
        getPublicMarketContract.then(result => {
          this.setState({
            publicMarket: result.contract
          }, () => {
            this.getProducts()
          })
        })
      })
    })
  }

  handleAddProduct(event) {
    this.props.history.push('/products/new')
  }

  getProducts() {
    var products = []

    // Add registration event listener
    var newRegistrationAll = this.state.registrar.NewRegistration({}, {fromBlock: 0, toBlock: 'latest'})
    newRegistrationAll.watch((error, result) => {

      if (!error) {

        const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)

        // Get the product info contract for the DIN
        const productInfoAddr = this.state.publicMarket.info(DIN)
        const productInfo = this.state.web3.eth.contract(productInfoABI.abi).at(productInfoAddr)

        // Get the price resolver for the DIN
        const priceResolverAddr = this.state.publicMarket.priceResolver(DIN)
        const priceResolver = this.state.web3.eth.contract(priceResolverABI.abi).at(priceResolverAddr)

        var productName

        productInfo.name(DIN, (error, name) => {

          if (!error) {
            productName = name

            priceResolver.price(DIN, (error, price) => {
              if (!error) {

                products.push({DIN: DIN, name: productName, price: price.toNumber() })

                this.setState({ products: products })
             }
           })
          }
        })

      } else {
        console.log(error)
      }

      newRegistrationAll = null
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
                  <th>Price</th>
                  <th>Edit</th>
                </tr>

                {this.state.products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <a href={"/DIN/" + product.DIN}>{product.DIN}</a>
                      </td>
                      <td>{product.name}</td>
                      <td>{(this.state.web3.fromWei(product.price, 'ether'))}</td>
                      <td>
                        <a href={"/product/" + product.DIN}>Edit</a>
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
