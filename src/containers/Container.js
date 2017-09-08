import React from "react";
import App from "../App";
import MarketplaceTable from "../components/tables/MarketplaceTable";
import PurchasesTable from "../components/tables/PurchasesTable";
import ProductsTable from "../components/tables/ProductsTable";
import SalesTable from "../components/tables/SalesTable";
import MarketTable from "../components/tables/MarketTable";

export const Marketplace = () => {
	return (
		<App selectedMenuItem={1}>
			<MarketplaceTable />
		</App>
	);
};

export const Purchases = () => {
	return (
		<App selectedMenuItem={2}>
			<PurchasesTable />
		</App>
	);
};

export const Products = () => {
	return (
		<App selectedMenuItem={3}>
			<ProductsTable />
		</App>
	);
};

export const Sales = () => {
	return (
		<App selectedMenuItem={4}>
			<SalesTable />
		</App>
	);
};

export const Market = ({ match }) => {
	return (
		<App selectedMenuItem={1}>
			<MarketTable address={match.params.market} />
		</App>
	);
};