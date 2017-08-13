import React, { Component } from 'react'
import { Table  } from 'react-bootstrap'
import getWeb3 from './utils/getWeb3'
import { getOrders } from './utils/getOrders'

class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      orderTracker: null,
      orders: [],
      showingSales: true
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3,
      }, () => {
        getOrders(this.state.web3, {buyer: this.state.web3.eth.accounts[0]}, {fromBlock: 0, toBlock: 'latest'}).then((orders) => {
          this.setState({orders: orders})
        })
      })
    })
  }

	render() {
		return (
      <div>
        <div className="container-orders-table">
          <div className="container-orders-header">
            <h1>Orders</h1>

          </div>

          <div className="orders-table">
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <th>Order ID</th>
                  <th>DIN</th>
                  <th>Seller</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
                {this.state.orders.map((order, index) => (<OrderItem order={order} key={order.orderID}/>))}
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
    return (
      <tr key={this.props.order.orderID}>
        <td>{this.props.order.orderID}</td>
        <td>{this.props.order.din}</td>
        <td>{this.props.order.seller}</td>
        <td>{this.props.order.quantity}</td>
        <td>{this.props.order.date}</td>
      </tr>
    );
  }
}

export default Orders;
