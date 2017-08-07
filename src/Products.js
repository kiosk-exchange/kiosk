import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { getDINRegistry, getENSMarket } from './utils/contracts'
import { getUserDINs, productFromDIN } from './utils/getProducts'
import ProductTable from './Components/ProductTable'

class Products extends Component {

	constructor(props) {
		super(props)

		this.state = {
			web3: null,
			products: []
		}

	}

	componentWillMount() {
		getWeb3.then((results) => {
			this.setState({ web3: results.web3 }, () => {
				// Get the global DIN registry
				getDINRegistry(this.state.web3).then((registry) => {
					this.setState({ DINRegistry: registry }, () => {
						// Get the ENSMarket, which is used to filter DINs in the DIN Registry
						getENSMarket(this.state.web3).then((market) => {
							this.setState({ market: market }, () => {
								this.getProducts()
							})
						})
					})
				})
			})
		})
	}

	getProducts() {
		getUserDINs(this.state.DINRegistry, this.state.web3.eth.coinbase).then((DINs) => {

			// Get product details (name, node, price) from the market
			var fullProducts = DINs.map((DIN) => {
				return productFromDIN(DIN, this.state.web3, this.state.market)
			})

			this.setState({ products: fullProducts })
		})

	}

	render() {
		return (
			<div className="product-table-container">
			  <div className="product-table-header">
          <h1 className="product-table-header-title">Products</h1>
        </div>
        <div className="product-table">
					<ProductTable products={this.state.products} handleBuy={this.handleBuy}/>
				</div>
			</div>
		)
	}

}

export default Products