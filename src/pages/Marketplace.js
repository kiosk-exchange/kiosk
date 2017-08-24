import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAllProducts } from "../utils/getProducts";
import Home from "../Home";
import MarketplaceTable from "../tables/MarketplaceTable";

class Marketplace extends Component {
	constructor(props) {
		super(props)

		this.state = {
			products: []
		}
	}

	componentWillMount() {
		getAllProducts(
			this.context.DINRegistry,
			this.context.web3
		).then(products => {
			this.setState({ products: products });
		});
	}

	render() {
		return (
			<Home {...this.props}>
				<MarketplaceTable products={this.state.products} />
			</Home>
		);
	}
}

Marketplace.contextTypes = {
  web3: PropTypes.object,
  DINRegistry: PropTypes.object
};

export default Marketplace;