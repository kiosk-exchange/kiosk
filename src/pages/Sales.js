import React, { Component } from "react";
import Home from "../Home";

class Sales extends Component {
	//   getSales() {
	//   getSales(this.context.web3, this.context.web3.eth.accounts[0]).then(orders => {
	//     this.setState({ orders: orders });
	//   });
	// }
	render() {
		return <Home {...this.props} />;
	}
}

export default Sales;