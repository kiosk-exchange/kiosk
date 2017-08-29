import React, { Component } from "react";
import PropTypes from "prop-types";
import { getMarketProducts } from "../utils/getProducts";
import MarketTable from "../tables/MarketTable";

class Market extends Component {
	constructor(props) {
		super(props);

		this.state = {
			products: []
		};

		this.handleBuy = this.handleBuy.bind(this);
	}

	componentWillMount() {
		getMarketProducts(
			this.context.DINRegistry,
			this.getMarket(),
			this.context.web3
		).then(products => {
			this.setState({ products: products });
		});
	}

	getMarket() {
		const path = this.props.location.pathname;
		const n = path.lastIndexOf("/");
		return path.substring(n + 1);
	}

	handleBuy() {
		console.log("BUY TAPPED")
	}

	render() {
		return (
			<MarketTable
				title={this.getMarket().slice(0, 12)}
				products={this.state.products}
				handleBuy={this.handleBuy}
			/>
		);
	}
}

Market.contextTypes = {
	web3: PropTypes.object,
	account: PropTypes.string,
	DINRegistry: PropTypes.object
};

export default Market;