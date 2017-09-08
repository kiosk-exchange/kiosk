import React from "react";
import TableContainer from "./TableContainer";
import DataTable from "./DataTable";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	products: state.results.products,
	filter: state.results.ownedDINs
});

export const ProductsTable = ({ products, filter }) => {
	const headers = ["DIN", "Name", "Price (KMT)", "Market"];
	const values = ["DIN", "name", "value", "market"];
	const emptyStateMessage = "You have no products";

	let data = [];

	if (products.length > 0 && filter) {
		data = products.filter(product => filter.includes(product.DIN));
	}

	return (
		<TableContainer
			title="Products"
			data={data}
			emptyStateMessage={emptyStateMessage}
		>
			<DataTable dataSource={data} headers={headers} values={values} />
		</TableContainer>
	);
};

export default connect(mapStateToProps)(ProductsTable);