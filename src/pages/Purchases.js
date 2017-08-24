import React, { Component } from "react";
import PropTypes from "prop-types";
import { getPurchases } from "../utils/getOrders";
import PurchasesTable from "../tables/PurchasesTable";

class Purchases extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orders: []
		};
	}

	componentWillMount() {
		getPurchases(
			this.context.web3,
			this.context.web3.eth.accounts[0]
		).then(orders => {
			this.setState({ orders: orders });
		});
	}

	render() {
		return <PurchasesTable orders={this.state.orders} />;
	}
}

Purchases.contextTypes = {
	web3: PropTypes.object,
	DINRegistry: PropTypes.object
};

export default Purchases;