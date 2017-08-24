import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Table,
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup
} from "react-bootstrap";
import { getOrders } from "./utils/getOrders";

const OrderType = {
  buyer: 1,
  seller: 2,
  properties: {
    1: { nameLabel: "Buyer", priceLabel: "Paid", value: 1 },
    2: { nameLabel: "Seller", priceLabel: "Revenue", value: 2 }
  }
};

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderTracker: null,
      orders: [],
      orderType: OrderType.buyer
    };

    this.didChangeOrderType = this.didChangeOrderType.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
  }

  componentWillMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    var args = null;
    const account = this.context.web3.eth.coinbase;
    switch (this.state.orderType) {
      case OrderType.buyer:
        args = { buyer: account };
        break;
      case OrderType.seller:
        args = { seller: account };
        break;
      default:
        break;
    }

    getOrders(this.context.web3, args, {
      fromBlock: 0,
      toBlock: "latest"
    }).then(orders => {
      this.setState({ orders: orders });
    });
  }

  didChangeOrderType(v) {
    this.setState({ orderType: v });
    this.fetchOrders();
  }

  render() {
    const statusStyle =
      this.state.orderType === OrderType.seller ? null : { display: "none" };

    return (
      <div>
        <div className="product-table-container">
          <div className="product-table-header">
            <h1 className="product-table-header-title">Orders</h1>
            <ButtonToolbar className="order-toggle">
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={1}
                onChange={this.didChangeOrderType}
              >
                <ToggleButton value={1}>Purchases</ToggleButton>
                <ToggleButton value={2}>Sales</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </div>
        </div>

        <div className="product-table-container">
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <th>Order ID</th>
                <th>DIN</th>
                <th>
                  {OrderType.properties[this.state.orderType].nameLabel}
                </th>
                <th>
                  {OrderType.properties[this.state.orderType].priceLabel}
                </th>
                <th>Quantity</th>
                <th>Date</th>
                <th style={statusStyle}>Status</th>
              </tr>
              {this.state.orders.map((order, index) =>
                <OrderItem
                  order={order}
                  key={order.orderID}
                  orderType={this.state.orderType}
                />
              )}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

class OrderItem extends Component {
  render() {
    const orderType = this.props.orderType;
    const order = this.props.order;
    const statusStyle =
      orderType === OrderType.seller ? null : { display: "none" };

    return (
      <tr key={order.orderID}>
        <td>
          {order.orderID}
        </td>
        <td>
          {order.din}
        </td>
        <td>
          {orderType === OrderType.buyer ? order.buyer : order.seller}
        </td>
        <td>
          {order.value}
        </td>
        <td>
          {order.quantity}
        </td>
        <td>
          {order.date}
        </td>
        <td style={statusStyle}>
          <a href="#">Collect</a>
        </td>
      </tr>
    );
  }
}

Orders.contextTypes = {
  web3: PropTypes.object
};

export default Orders;