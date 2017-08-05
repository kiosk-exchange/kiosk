import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'

import ProductTable from './Components/ProductTable'

class Market extends Component {

	constructor(props) {
		super(props)

		const products = [
			{
				'DIN': 1000000001,
				'name': 'Sample',
				'price': 0.1
			},
			{
				'DIN': 1000000002,
				'name': 'Dummy',
				'price': 1.0
			}
		]

		this.state = {
			products: products
		}

	}

	render() {
		return (
			<div className="market">
			  <div className="container-products-header">
          <h1 className="products-header">{this.props.name}</h1>
          <button className="add-product-button" onClick={this.handleAddProduct}>
            Add ENS Domain
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