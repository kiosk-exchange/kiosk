import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { getMarketDINs, productFromDIN } from "./utils/getProducts";
import ProductTable from "./Components/ProductTable";
import MarketJSON from "./../build/contracts/Market.json";

class Market extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null,
			DINRegistry: null,
			market: null,
			title: "",
			products: []
		};

		this.handleAddProduct = this.handleAddProduct.bind(this);
		this.handleBuy = this.handleBuy.bind(this);
	}

	componentWillMount() {
		getWeb3.then(results => {
			this.setState({ web3: results.web3 }, () => {
				// Get the global DIN registry
				getDINRegistry(this.state.web3).then(registry => {
					this.setState({ DINRegistry: registry }, () => {
							const marketContract = this.state.web3.eth.contract(MarketJSON.abi);
  						const market = marketContract.at(this.props.match.params.market);
  						const title = market.title();
  						this.setState({ title: title });
							this.getProducts();
					});
				});
			});
		});
	}

	handleAddProduct(event) {
		this.props.history.push("/products/new/ens");
	}

	handleBuy(index) {
		const product = this.state.products[index];
		const buyer = this.state.web3.eth.accounts[1];

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
					console.log(result);
				} else {
					console.log(error);
				}
			}
		);
	}

	getProducts() {
		getMarketDINs(
			this.state.DINRegistry,
			this.props.match.params.market // The address of the market
		).then(DINs => {
			// Get product details (name, node, price) from the market
			var fullProducts = DINs.map(DIN => {
				return productFromDIN(DIN, this.state.web3, this.props.match.params.market);
			});

			this.setState({ products: fullProducts });
		});
	}

	render() {
		return (
			<div className="product-table-container">
				<div className="product-table-header">
					<h1 className="product-table-header-title">
						{this.state.title}
					</h1>
				</div>
				<div className="product-table">
					<ProductTable
						products={this.state.products}
						handleBuy={this.handleBuy}
					/>
				</div>
			</div>
		);
	}
}

export default Market;