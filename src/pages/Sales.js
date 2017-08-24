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
			this.context.account
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
	account: PropTypes.string,
	DINRegistry: PropTypes.object
};

export default Sales;