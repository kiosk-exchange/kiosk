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
			this.context.account,
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
	account: PropTypes.string,
	DINRegistry: PropTypes.object
};

export default Products;