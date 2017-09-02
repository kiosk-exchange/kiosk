import React, { Component } from "react";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle } from "./TableStyles";
import BaseTableContainer from "./BaseTableContainer";
import { OrderTableRow } from "./OrderTableRow";

export const OrdersTable = ({ orders }) => {
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
        rows={orders.map(order => {
          return (
            <OrderTableRow order={order} />
          );
        })}
      />
    );
}