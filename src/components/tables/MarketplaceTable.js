import React from "react";
import TableContainer from "./TableContainer";
import DataTable from "./DataTable";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	products: state.results.products
});

const MarketplaceTable = ({ products }) => {
	const headers = ["DIN", "Name", "Price (KMT)", "Market", "Buy"];
	const values = ["DIN", "name", "value", "market", "buy"];
	const emptyStateMessage = "Marketplace not available";
	return (
		<TableContainer title="Marketplace" data={products} emptyStateMessage={emptyStateMessage}>
			<DataTable
				dataSource={products}
				headers={headers}
				values={values}
			/>
		</TableContainer>
	);
};

export default connect(mapStateToProps)(MarketplaceTable)