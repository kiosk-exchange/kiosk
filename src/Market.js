import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { getDINRegistry, getDINRegistrar } from './utils/contracts'
import getProducts from './utils/getProducts'

import MockProducts from './utils/MockProducts.js'
import ProductTable from './Components/ProductTable'

class Market extends Component {

	constructor(props) {
		super(props)

		this.state = {
			web3: null,
			DINRegistry: null,
			DINRegistrar: null,
			products: []
		}

		this.handleAddProduct = this.handleAddProduct.bind(this)
	}

	componentWillMount() {
		getWeb3.then((results) => {
			this.setState({ web3: results.web3 })
			getDINRegistry(results.web3).then((registry) => {
					this.setState({ DINRegistry: registry }, () => {
						this.getProducts(results.web3)
				})
			})
		})
	}

	handleAddProduct(event) {
		this.props.history.push('/products/new')
	}

	getProducts(web3) {
		getDINRegistrar(web3).then((registrar) => {
			this.setState({ DINRegistrar: registrar })
			getProducts(this.state.DINRegistry, registrar).then((products) => {
				this.setState({ products: products })
			})
		})
	}

	render() {
		return (
			<div className="market">
			  <div className="container-products-header">
          <h1 className="products-header">{this.props.name}</h1>
          <button className="add-product-button" onClick={this.handleAddProduct}>
            {this.props.addProduct}
          </button>
        </div>
        <div className="market-product-table">
					<ProductTable products={this.state.products}/>
				</div>
			</div>
		)
	}

}

export default Market