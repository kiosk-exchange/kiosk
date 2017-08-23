import React, { Component } from "react";
import OrdersTable from "./OrdersTable";

class SalesTable extends Component {
  render() {
    return (
      <OrdersTable orders={this.props.orders} userHeader="Buyer" userValue="buyer"/>
    );
  }
}

export default SalesTable;