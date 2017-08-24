import React, { Component } from "react";
import PropTypes from "prop-types";
import { getMarketProducts } from "../utils/getProducts";
import ProductsTable from "../tables/ProductsTable";

class Market extends Component {
	constructor(props) {
		super(props);

		console.log("HI")

		this.state = {
			products: []
		};
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

	render() {
		return (
			<ProductsTable
				title={this.props.match.params.market.slice(0, 12)}
				products={this.state.products}
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