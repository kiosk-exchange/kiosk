import React, { Component } from "react";
import TableContainer from "./TableContainer";
import DataTable from "./DataTable";
import { connect } from "react-redux";

const mapStateToProps = state => {
	return {
		products: state.results.products,
		filter: state.results.marketDINs,
		market: state.selectedMarket
	};
};

class MarketTable extends Component {
	render() {
		const { market, products, filter } = this.props;

		const headers = ["DIN", "Name", "Price (KMT)", "Buy"];
		const values = ["DIN", "name", "value", "buy"];
		const emptyStateMessage = "No products in this market";

		let data = [];

		if (products.length > 0 && filter && market) {
			data = products.filter(product => filter.includes(product.DIN));

			return (
				<TableContainer
					title={market.name}
					subtitle={market.address}
					data={data}
					emptyStateMessage={emptyStateMessage}
				>
					<DataTable
						dataSource={data}
						headers={headers}
						values={values}
					/>
				</TableContainer>
			);
		}
		return null;
	}
}

export default connect(mapStateToProps)(MarketTable);