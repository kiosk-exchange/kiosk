import React, { Component } from "react";

export const OrderTableRow = ({ order, }) => {
	return (
		<TableRow key={order.orderID}>
			<TableRowColumn>
				{order.orderID}
			</TableRowColumn>
			<TableRowColumn>
				{order.DIN}
			</TableRowColumn>
			{userColumn}
			<TableRowColumn>
				{order.value}
			</TableRowColumn>
			<TableRowColumn>
				{order.quantity}
			</TableRowColumn>
			<TableRowColumn>
				{order.date}
			</TableRowColumn>
		</TableRow>
	);
};