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
			this.props.match.params.market,
			this.context.web3
		).then(products => {
			this.setState({ products: products });
		});
	}

	handleBuy() {
		console.log("BUY TAPPED")
	}

	render() {
		return (
			<MarketTable
				title={this.props.match.params.market.slice(0, 12)}
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