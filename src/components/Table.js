import React from "react";
import { Link } from "react-router-dom";
import { v4 } from "node-uuid";

import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from "material-ui/Table";
import BuyColumn from "./BuyColumn";

const DataTable = ({ dataSource, headers, values }) => {
	const tableStyle = {
		borderStyle: "solid",
		borderWidth: "1px",
		borderColor: "#E0E0E0"
	};
	const linkStyle = {
		color: "#32C1FF",
		textDecoration: "none"
	};
	return (
		<Table style={tableStyle} height="420px" selectable={false}>
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					{headers.map(header => {
						return (
							<TableHeaderColumn key={v4()} style={{fontSize: "15px"}}>
								{header}
							</TableHeaderColumn>
						);
					})}
				</TableRow>
			</TableHeader>;
			<TableBody displayRowCheckbox={false}>
				{dataSource.map((item, index) => {
					return (
						<TableRow key={v4()} style={{ height: "70px" }}>
							{values.map(value => {
								if (value === "buy") {
									return (
										<BuyColumn key={v4()} index={index} />
									);
								} else if (value === "market") {
									return (
										<TableRowColumn key={v4()}>
											<Link
												style={linkStyle}
												to={`/market/${item[value]}`}
												onClick={console.log("SELECTED MARKET: " + item[value])}
											>
												{item[value].slice(0, 12)}
											</Link>
										</TableRowColumn>
									);
								}
								return (
									<TableRowColumn
										key={v4()}
										style={{ whiteSpace: "normal", textAlign: (value === "value" || value === "quantity") ? "right" : "left" }}
									>
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
	const headers = ["Order ID", "DIN", "Value (KMT)", "Seller", "Quantity", "Date"];
	const values = ["orderID", "DIN", "value", "seller", "quantity", "date"];
	return <DataTable dataSource={orders} headers={headers} values={values} />;
};

export const SalesTable = ({ orders }) => {
	const headers = ["Order ID", "DIN", "Value (KMT)", "Buyer", "Quantity", "Date"];
	const values = ["orderID", "DIN", "value", "buyer", "quantity", "date"];
	return <DataTable dataSource={orders} headers={headers} values={values} />;
};