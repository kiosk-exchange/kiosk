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
import { MENU_ITEM } from "../redux/actions";

const mapStateToProps = state => ({
	title: state.config.menuItems[state.selectedMenuItemId - 1],
	theme: state.config.theme,
	isLoading: state.results.isLoading,
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
				</div>
			</div>
		);

		let dataSource = null;

		switch (selectedMenuItemId) {
			case MENU_ITEM.MARKETPLACE:
				dataSource = allProducts;
				break;
			case MENU_ITEM.PURCHASES:
				dataSource = purchases;
				break;
			case MENU_ITEM.PRODUCTS:
				dataSource = ownerProducts;
				break;
			case MENU_ITEM.SALES:
				dataSource = sales;
				break;
			default:
				break;
		}

		let table = null;
		// let emptyState = null;

		if (dataSource !== null) {
			switch (selectedMenuItemId) {
				case MENU_ITEM.MARKETPLACE:
					table = <MarketplaceTable products={dataSource} />;
					break;
				case MENU_ITEM.PURCHASES:
					table = <PurchasesTable orders={dataSource} />;
					break;
				case MENU_ITEM.PRODUCTS:
					table = <ProductsTable products={dataSource} />;
					break;
				case MENU_ITEM.SALES:
					table = <SalesTable orders={dataSource} />;
					break;
				default:
					break;
			}
		}

		let loader = null;

		if (isLoading === true && dataSource === null) {
			loader = (
				<CircularProgress
					style={{ padding: "80px", textAlign: "center" }}
					size={80}
					thickness={6}
					color={theme.blue}
				/>
			);
		}

		// else if (isLoading === false) {
		// 	return <h1>There's nothing to see here</h1>
		// }

		return (
			<div>
				{titleSection}
				<div
					style={{
						display: "flex",
						width: "100%",
						padding: "0px",
						margin: "0px",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{loader}
				</div>
				{table}
			</div>
		);
	}
}

export default connect(mapStateToProps)(TableContainer);