import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import MockProducts from './utils/MockProducts.js'

import ProductTable from './Components/ProductTable'

class Market extends Component {

	constructor(props) {
		super(props)

		this.state = {
			// TODO: This should eventually be coming from either DIN Registry (filtered by market) or the market itself
			products: MockProducts
		}

		this.handleAddProduct = this.handleAddProduct.bind(this)
	}

	handleAddProduct(event) {
		this.props.history.push('/products/new')
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