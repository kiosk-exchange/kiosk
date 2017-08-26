import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAllProducts } from "../utils/getProducts";
import MarketplaceTable from "../tables/MarketplaceTable";

class Marketplace extends Component {
	constructor(props) {
		super(props);

		this.state = {
			products: []
		};

		this.handleBuy = this.handleBuy.bind(this);
	}

	componentWillMount() {
		if (this.context.web3) {
			getAllProducts(
				this.context.DINRegistry,
				this.context.web3
			).then(products => {
				this.setState({ products: products });
			});
		}
	}

	handleBuy() {
		console.log("BUY TAPPED");
	}

	render() {
		if (this.context.web3) {
			return (
				<MarketplaceTable
					products={this.state.products}
					handleBuy={this.handleBuy}
				/>
			);
		}
		return null;
	}
}

Marketplace.contextTypes = {
	web3: PropTypes.object,
	DINRegistry: PropTypes.object
};

export default Marketplace;