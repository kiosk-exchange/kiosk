import React from "react";
import { v4 } from "node-uuid";

import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from "material-ui/Table";
import BuyColumn from "../tables/BuyColumn";

const DataTable = ({ dataSource, headers, values }) => {
	const tableStyle = {
		borderStyle: "solid",
		borderWidth: "1px",
		borderColor: "#E0E0E0"
	};
	// Empty state needed
	if (!dataSource) {
		return null;
	}
	return (
		<Table style={tableStyle} height="420px" selectable={false}>
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					{headers.map(header => {
						return (
							<TableHeaderColumn key={v4()}>
								{header}
							</TableHeaderColumn>
						);
					})}
				</TableRow>
			</TableHeader>;
			<TableBody displayRowCheckbox={false}>
				{dataSource.map((item, index) => {
					return (
						<TableRow key={v4()}>
							{values.map(value => {
								if (value === "buy") {
									return <BuyColumn key={v4()} index={index} />;
								}
								return (
									<TableRowColumn key={v4()}>
										{item[value]}
									</TableRowColumn>
								);
							})}
						</TableRow>
					);
				})};
			</TableBody>
		</Table>
	);
};

export const MarketplaceTable = ({ products }) => {
	const headers = ["DIN", "Name", "Price (KMT)", "Market", "Buy"];
	const values = ["DIN", "name", "value", "market", "buy"];
	return (
		<DataTable dataSource={products} headers={headers} values={values} />
	);
};

export const MarketTable = ({ products }) => {
	const headers = ["DIN", "Name", "Price (KMT)", "Buy"];
	const values = ["DIN", "name", "value", "buy"];
	return (
		<DataTable dataSource={products} headers={headers} values={values} />
	);
};

export const ProductsTable = ({ products }) => {
	const headers = ["DIN", "Name", "Price (KMT)", "Market"];
	const values = ["DIN", "name", "value", "market"];
	return (
		<DataTable dataSource={products} headers={headers} values={values} />
	);
};

export const PurchasesTable = ({ orders }) => {
	const headers = ["Order ID", "DIN", "Value", "Seller", "Quantity", "Date"];
	const values = ["orderID", "DIN", "value", "seller", "quantity", "date"];
	return <DataTable dataSource={orders} headers={headers} values={values} />;
};

export const SalesTable = ({ orders }) => {
	const headers = ["Order ID", "DIN", "Value", "Buyer", "Quantity", "Date"];
	const values = ["orderID", "DIN", "value", "buyer", "quantity", "date"];
	return <DataTable dataSource={orders} headers={headers} values={values} />;
};