import React, { Component } from "react";
import PropTypes from "prop-types";
import { getSales } from "../utils/getOrders";
import SalesTable from "../tables/SalesTable";

class Sales extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orders: []
		};
	}

	componentWillMount() {
		getSales(
			this.context.web3,
			this.context.web3.eth.accounts[0]
		).then(orders => {
			this.setState({ orders: orders });
		});
	}

	render() {
		return <SalesTable orders={this.state.orders} />;
	}
}

Sales.contextTypes = {
	web3: PropTypes.object,
	DINRegistry: PropTypes.object
};

export default Sales;