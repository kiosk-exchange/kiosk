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
import BuyColumn from "./BuyColumn";
import MarketColumn from "./MarketColumn";

const DataTable = ({ dataSource, headers, values }) => {
	const tableStyle = {
		borderStyle: "solid",
		borderWidth: "1px",
		borderColor: "#E0E0E0"
	};

	return (
		<Table style={tableStyle} height="420px" selectable={false}>
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					{headers.map(header => {
						return (
							<TableHeaderColumn
								key={v4()}
								style={{ fontSize: "15px" }}
							>
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
										<BuyColumn key={v4()} DIN={item.DIN} />
									);
								} else if (value === "market") {
									const market = {
										name: item.marketName,
										address: item.market
									};
									return (
										<MarketColumn
											key={v4()}
											market={market}
										/>
									);
								}
								return (
									<TableRowColumn
										key={v4()}
										style={{
											whiteSpace: "normal",
											textAlign:
												value === "value" ||
												value === "quantity"
													? "right"
													: "left"
										}}
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

export default DataTable;