import React from "react";
import TableContainer from "./TableContainer";
import DataTable from "./DataTable";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	purchases: state.results.purchases
});

export const PurchasesTable = ({ purchases }) => {
	const headers = [
		"Order ID",
		"DIN",
		"Value (KMT)",
		"Seller",
		"Quantity",
		"Metadata",
		"Date"
	];
	const values = ["orderID", "DIN", "value", "seller", "quantity", "metadata", "date"];
	const emptyStateMessage = "You have no purchases";

	return (
		<TableContainer title="Purchases" data={purchases} emptyStateMessage={emptyStateMessage}>
			<DataTable
				dataSource={purchases}
				headers={headers}
				values={values}
			/>
		</TableContainer>
	);
};

export default connect(mapStateToProps)(PurchasesTable)