import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { getDINRegistry, getDINRegistrar } from './utils/contracts'
import getProducts from './utils/getProducts'
import ProductTable from './Components/ProductTable'
import PublicMarketJSON from './../build/contracts/PublicMarket.json'
import ENSMarketJSON from './../build/contracts/ENSMarket.json'

class Market extends Component {

	constructor(props) {
		super(props)

		this.state = {
			web3: null,
			DINRegistry: null,
			DINRegistrar: null,
			market: null,
			products: []
		}

		this.handleAddProduct = this.handleAddProduct.bind(this)
		this.handleBuy = this.handleBuy.bind(this)
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

	handleBuy(index) {
		const product = this.state.products[index]
		// console.log(product)

		console.log(this.state.market.totalPrice(product.DIN, 1).toNumber())
		console.log(this.state.web3.eth.coinbase)

		this.state.market.buy(10000001, { from: this.state.web3.eth.coinbase, value: product.price, gas: 4700000 }, (error, result) => {
			if (!error) {
				console.log(result)
			} else {
				console.log(error)
			}
		})
	}

	getProducts(web3) {
		getDINRegistrar(web3).then((registrar) => {
			this.setState({ DINRegistrar: registrar })
			getProducts(this.state.DINRegistry, registrar).then((products) => {
				var newProducts = products.map((product) => {
					const market = this.state.DINRegistry.market(product.DIN)
					product.market = market

					const publicMarket = this.state.web3.eth.contract(PublicMarketJSON.abi).at(market)
					this.setState({ market: publicMarket })
					const price = publicMarket.totalPrice(product.DIN, 1).toNumber()
					product.price = price

					const ensMarket = this.state.web3.eth.contract(ENSMarketJSON.abi).at(market)
					const node = ensMarket.ENSNode(product.DIN)
					product.node = node

					return product
				})
				this.setState({ products: newProducts })
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
					<ProductTable products={this.state.products} handleBuy={this.handleBuy}/>
				</div>
			</div>
		)
	}

}

export default Market