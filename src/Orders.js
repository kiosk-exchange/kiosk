import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import getWeb3 from './utils/getWeb3'
import { getOrderTracker } from './utils/contracts'


class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      orderTracker: null,
      orders: []
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3,
      }, () => {
        this.getOrderContract()
      })
    })
  }

  getOrderContract() {
    getOrderTracker(this.state.web3).then(contract => {
      this.setState({ orderTracker: contract })

      var fetchOrders = contract.NewOrder({buyer: this.state.web3.eth.accounts[0]}, {fromBlock: 0, toBlock: 'latest'})
      fetchOrders.watch((error, result) => {
        if (!error) {
          var orders = this.state.orders
          const din = result["args"]["DIN"]["c"][0]
          const quantity = result["args"]["quantity"]["c"][0]
          const market = result["args"]["market"]
          const seller = result["args"]["seller"]
          const orderID = result["args"]["orderID"]["c"][0]
          const info = result["args"]["info"]
          const timestamp = parseInt(result["args"]["timestamp"], 10)

          orders.push({din: din, quantity: quantity, market: market, orderID: orderID, info: info, date: this.date(timestamp), seller: seller})
          this.setState({orders: orders})
        } else {
          console.log(error)
          fetchOrders.stopWatching()
        }
      })
    })
  }

  date(timestamp) {
    var date = new Date(timestamp*1000)

    var month = date.getUTCMonth() + 1 //months from 1-12
    var day = date.getUTCDate()
    var year = date.getUTCFullYear()

    var formattedDate = month + "/" + day + "/" + year
    return formattedDate
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
