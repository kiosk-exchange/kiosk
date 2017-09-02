import React, { Component } from "react";
import CircularProgress from "material-ui/CircularProgress";
import { connect } from "react-redux";
import {
	MarketplaceTable,
	// MarketTable,
	PurchasesTable,
	ProductsTable,
	SalesTable
} from "../components/Table";

const mapStateToProps = state => ({
	title: state.config.menuItems[state.selectedMenuItemId],
	theme: state.config.theme,
	isLoading: false,
	allProducts: state.results.allProducts,
	ownerProducts: state.results.ownerProducts,
	purchases: state.results.purchases,
	sales: state.results.sales,
	selectedMenuItemId: state.selectedMenuItemId
});

class TableContainer extends Component {
	render() {
		const {
			title,
			theme,
			isLoading,
			allProducts,
			ownerProducts,
			purchases,
			sales,
			selectedMenuItemId
		} = this.props;

		const headerStyle = {
			color: theme.gray,
			fontWeight: "medium"
		};

		let loader = null;

		if (isLoading === true) {
			loader = (
				<CircularProgress
					style={{ marginLeft: "auto", paddingRight: "20px" }}
					size={40}
					thickness={6}
					color={theme.blue}
				/>
			);
		}

		const titleSection = (
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						width: "100%",
						alignItems: "center"
					}}
				>
					<h1 style={headerStyle}>
						{title}
					</h1>
					{loader}
				</div>
			</div>
		);

		let table = null;

		switch (selectedMenuItemId) {
			case 0:
				table = <MarketplaceTable products={allProducts} />;
				break;
			case 1:
				table = <PurchasesTable orders={purchases} />;
				break;
			case 2:
				table = <ProductsTable products={ownerProducts} />;
				break;
			case 3:
				table = <SalesTable orders={sales} />;
				break;
			default:
				break;
		}

		return (
			<div>
				{titleSection}
				{table}
			</div>
		);
	}
}

export default connect(mapStateToProps)(TableContainer);