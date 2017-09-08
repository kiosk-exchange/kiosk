import React from "react";
import TableContainer from "./TableContainer";
import DataTable from "./DataTable";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	sales: state.results.sales
});

export const SalesTable = ({ sales }) => {
	const headers = [
		"Order ID",
		"DIN",
		"Value (KMT)",
		"Buyer",
		"Quantity",
		"Date"
	];
	const values = ["orderID", "DIN", "value", "buyer", "quantity", "date"];
	const emptyStateMessage = "You have no sales";

	return (
		<TableContainer title="Sales" data={sales} emptyStateMessage={emptyStateMessage}>
			<DataTable
				dataSource={sales}
				headers={headers}
				values={values}
			/>
		</TableContainer>
	);
};

export default connect(mapStateToProps)(SalesTable)