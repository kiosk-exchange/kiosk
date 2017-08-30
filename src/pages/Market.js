import React, { Component } from "react";
import PropTypes from "prop-types";
import { getMarketProducts, getMarketName } from "../utils/getProducts";
import MarketTable from "../tables/MarketTable";

class Market extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			products: []
		};

		this.handleBuyClick = this.handleBuyClick.bind(this);
	}

	componentWillMount() {
		this.getData();

		const market = this.getMarket();
		getMarketName(this.context.web3, market).then(name => {
			this.setState({ name: name })
		})
	}

	getData() {
		getMarketProducts(
			this.context.DINRegistry,
			this.getMarket(),
			this.context.web3
		).then(products => {
			this.setState({ products: products });
		});
	}

	handleBuyClick(product) {
		this.props.handleBuyClick(product);
	}

	getMarket() {
		const path = this.props.location.pathname;
		const n = path.lastIndexOf("/");
		return path.substring(n + 1);
	}

	render() {
		if (this.context.refresh === true) {
			this.getData();
		}

		return (
			<MarketTable
				title={this.state.name}
				products={this.state.products}
				handleBuyClick={this.handleBuyClick}
			/>
		);
	}
}

Market.contextTypes = {
	web3: PropTypes.object,
	account: PropTypes.string,
	DINRegistry: PropTypes.object,
	refresh: PropTypes.bool
};

export default Market;