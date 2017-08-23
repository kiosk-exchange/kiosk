import React, { Component } from "react";
import OrdersTable from "./OrdersTable";

class PurchasesTable extends Component {
  render() {
    return (
      <OrdersTable orders={this.props.orders} userHeader="Seller" userValue="seller"/>
    );
  }
}

export default PurchasesTable;