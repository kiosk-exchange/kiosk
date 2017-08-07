import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { getDINRegistry, getENSMarket } from './utils/contracts'
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
		getProducts(this.state.DINRegistry, this.state.market.address).then((products) => {

			// Get product details (name, node, price) from the market
			var fullProducts = products.map((product) => {
				const market = this.state.DINRegistry.market(product.DIN)
				product.market = market

				const publicMarket = this.state.web3.eth.contract(PublicMarketJSON.abi).at(market)

				// Get the price from the perspective of the null account. Otherwise, price will show up as zero if the buyer is also the seller.
				const price = publicMarket.totalPrice(product.DIN, 1, {from: '0x0000000000000000000000000000000000000000'}).toNumber()
				product.price = price
				product.formattedPrice = this.state.web3.fromWei(price, 'ether')

				const ensMarket = this.state.web3.eth.contract(ENSMarketJSON.abi).at(market)
				this.setState({ market: ensMarket })

				const node = ensMarket.ENSNode(product.DIN)
				product.node = node

				const name = ensMarket.name(product.DIN)
				product.name = name

				// If the product is available for sale, show a "Buy Now" button
				if (this.state.market.isAvailableForSale(product.DIN) === true) {
					product.available = true
				} else {
					product.available = false
				}

				return product
			})

			this.setState({ products: fullProducts })
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