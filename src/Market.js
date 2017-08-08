import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { getDINRegistry, getENSMarket } from './utils/contracts'
import { getMarketDINs, productFromDIN } from './utils/getProducts'
import ProductTable from './Components/ProductTable'

class Market extends Component {

	constructor(props) {
		super(props)

		this.state = {
			web3: null,
			DINRegistry: null,
			market: null,
			products: []
		}

		this.handleAddProduct = this.handleAddProduct.bind(this)
		this.handleBuy = this.handleBuy.bind(this)
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

	handleAddProduct(event) {
		this.props.history.push('/products/new/ens')
	}

	handleBuy(index) {		
		const product = this.state.products[index]
		const buyer = this.state.web3.eth.accounts[1]

		this.state.market.buy(
			product.DIN, 
			1, // Quantity
			{
				from: buyer, 
				value: product.price, 
				gas: 4700000
			}, 
			(error, result) => {
			if (!error) {
				console.log(result)
			} else {
				console.log(error)
			}
		})
	}

	getProducts() {
		getMarketDINs(this.state.DINRegistry, this.state.market.address).then((DINs) => {

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
          <h1 className="product-table-header-title">{this.props.name}</h1>
          <button className="product-table-header-button" onClick={this.handleAddProduct}>
            {this.props.addProduct}
          </button>
        </div>
        <div className="product-table">
					<ProductTable products={this.state.products} handleBuy={this.handleBuy}/>
				</div>
			</div>
		)
	}

}

export default Market