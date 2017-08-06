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
				var newProducts = products.map((product) => {
					const market = this.state.DINRegistry.market(product.DIN)
					product.market = market

					const publicMarket = this.state.web3.eth.contract(PublicMarketJSON.abi).at(market)
					const price = publicMarket.totalPrice(product.DIN, 1).toNumber()
					product.price = web3.fromWei(price, 'ether')

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
					<ProductTable products={this.state.products}/>
				</div>
			</div>
		)
	}

}

export default Market