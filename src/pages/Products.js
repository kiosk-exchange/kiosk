import React, { Component } from "react";
import Home from "../Home";

class Products extends Component {
	//  getSellerProducts() {
	//   getSellerProducts(
	//     this.state.DINRegistry,
	//     this.context.web3.eth.accounts[0],
	//     this.context.web3
	//   ).then(products => {
	//     this.setState({ products: products });
	//   });
	// }

	render() {
		return <Home {...this.props} />;
	}
}

export default Products;