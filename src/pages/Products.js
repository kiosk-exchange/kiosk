import React, { Component } from "react";
import PropTypes from "prop-types";
import { getSellerProducts } from "../utils/getProducts";
import ProductsTable from "../tables/ProductsTable";

class Products extends Component {
	constructor(props) {
		super(props);

		this.state = {
			products: []
		};
	}

	componentWillMount() {
		getSellerProducts(
			this.context.DINRegistry,
			this.context.web3.eth.accounts[0],
			this.context.web3
		).then(products => {
			this.setState({ products: products });
		});
	}

	render() {
		return <ProductsTable products={this.state.products} />;
	}
}

Products.contextTypes = {
	web3: PropTypes.object,
	DINRegistry: PropTypes.object
};

export default Products;