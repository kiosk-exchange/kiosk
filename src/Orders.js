import React, { Component } from 'react'
import { Table, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import getWeb3 from './utils/getWeb3'
import { getOrders } from './utils/getOrders'

class Orders extends Component {
  constructor(props) {
    super(props)

    this.didChangeOrderType = this.didChangeOrderType.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);

    /*Order Type Selection:
      1: All
      2: Sales
      3: Purchases
    */
    this.state = {
      web3: null,
      orderTracker: null,
      orders: [],
      orderTypeSelection: 1
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3,
      }, () => {
        this.fetchOrders()
      })
    })
  }

  fetchOrders() {
    var args = null
    const orderType = this.state.orderTypeSelection
    switch(orderType) {
      case 1:
        args = {buyer: this.state.web3.eth.accounts[0]}
        break;
      case 2:
        args = {buyer: this.state.web3.eth.accounts[0]}
        break;
      case 3:
        args = {seller: this.state.web3.eth.accounts[0]}
        break;
      default:
        break
    }

    getOrders(this.state.web3, args, {fromBlock: 0, toBlock: 'latest'}).then((orders) => {
      this.setState({orders: orders})
    })
  }

  didChangeOrderType(v) {
    this.setState({orderTypeSelection: v})
    this.fetchOrders()
  }

	render() {
    const orderType = this.state.orderTypeSelection
    var typeLabel = ""
    switch(orderType) {
      case 1:
        typeLabel = "Seller/Buyer"
        break;
      case 2:
        typeLabel = "Buyer"
        break;
      case 3:
        typeLabel = "Seller"
        break;
      default:
        break
    }

		return (
      <div>
        <div className="container-orders-table">
          <div className="container-orders-header">
            <h1>Orders</h1>
            <ButtonToolbar>
              <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.didChangeOrderType}>
                <ToggleButton value={1}>All</ToggleButton>
                <ToggleButton value={2}>Sales</ToggleButton>
                <ToggleButton value={3}>Purchases</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </div>

          <div className="orders-table">
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <th>Order ID</th>
                  <th>DIN</th>
                  <th>{typeLabel}</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
                {this.state.orders.map((order, index) => (<OrderItem order={order} key={order.orderID} orderType={this.props.orderTypeSelection}/>))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
		);
  }
}

class OrderItem extends Component {
  render() {
    const orderType = this.props.orderType
    const order = this.props.order

    return (
      <tr key={order.orderID}>
        <td>{order.orderID}</td>
        <td>{order.din}</td>
        <td>{orderType == 2 ? order.buyer : order.seller}</td>
        <td>{order.quantity}</td>
        <td>{order.date}</td>
      </tr>
    );
  }
}

export default Orders;
