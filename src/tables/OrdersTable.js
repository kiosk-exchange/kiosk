import React, { Component } from "react";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle } from "./TableStyles";
import BaseTableContainer from "./BaseTableContainer";

class OrdersTable extends Component {
  render() {
    return (
      <BaseTableContainer
        title={this.props.title}
        headers={[
          "Order ID",
          "DIN",
          this.props.userHeader,
          "Value",
          "Quantity",
          "Date"
        ]}
        rows={this.props.orders.map(order => {
          return (
            <TableRow style={tableRowStyle} key={order.orderID}>
              <TableRowColumn>
                {order.orderID}
              </TableRowColumn>
              <TableRowColumn>
                {order.DIN}
              </TableRowColumn>
              <TableRowColumn>
                {order[this.props.userValue]}
              </TableRowColumn>
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
        })}
      />
    );
  }
}

export default OrdersTable;