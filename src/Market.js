import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { getMarketDINs, infoFromDIN } from "./utils/getProducts";
import MarketJSON from "./../build/contracts/Market.json";
import BuyModal from "./Components/BuyModal";
import KioskTable from "./Components/KioskTable";

class Market extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null,
			DINRegistry: null,
			market: null,
			title: "",
			products: [],
			selectedProduct: {},
			showBuyModal: false
		};

		this.handleAddProduct = this.handleAddProduct.bind(this);
		this.handleSelectProduct = this.handleSelectProduct.bind(this);
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

	handleAddProduct(event) {}

	getProducts() {
		getMarketDINs(
			this.state.DINRegistry,
			this.props.match.params.market // The address of the market
		).then(DINs => {
			var fullProducts = DINs.map(DIN => {
				return infoFromDIN(DIN, this.state.web3, this.state.DINRegistry);
			});
			this.setState({ products: fullProducts });
		});
	}

	handleSelectProduct(product) {
		this.setState({
			showBuyModal: true,
			selectedProduct: product
		});
	}

	render() {
		let hideBuyModal = () => this.setState({ showBuyModal: false });

		return (
			<div className="product-table-container">
				<div className="product-table-header">
					<h1 className="product-table-header-title">
						{this.state.title}
					</h1>
				</div>
				<div className="product-table">
					<KioskTable
						headers={["DIN", "Product Name", "Price"]}
						products={this.state.products}
						handleSelectProduct={this.handleSelectProduct}
					/>
				</div>
				<BuyModal
					show={this.state.showBuyModal}
					onHide={hideBuyModal}
					product={this.state.selectedProduct}
					web3={this.state.web3}
				/>
			</div>
		);
	}
}

export default Market;