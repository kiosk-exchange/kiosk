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
          console.log(result["args"]["DIN"]["c"][0])
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

  getOrders() {
    var orders = []
    // Add order event listener
    var newOrderEventAll = this.state.publicMarket.NewOrder({}, {fromBlock: 0, toBlock: 'latest'})
    newOrderEventAll.watch((error, result) => {
      if (!error) {

        console.log(result)

        const orderID = result["args"]["orderID"]["c"][0]
        const DIN = result["args"]["DIN"]["c"][0]
        const buyer = result["args"]["buyer"]

        const amountPaid = parseInt(result["args"]["amountPaid"], 10)
        const etherPaid = this.state.web3.fromWei(amountPaid, 'ether')

        const timestamp = parseInt(result["args"]["timestamp"], 10)
        const date = this.date(timestamp)

        orders.push(
          {
            orderID: orderID,
            DIN: DIN,
            buyer: buyer,
            amountPaid: etherPaid,
            date: date
          }
        )

        this.setState({ orders: orders })
      } else {
        console.log(error)
      }

      newOrderEventAll = null
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
                  <th>Buyer</th>
                  <th>Paid</th>
                  <th>Date</th>
                </tr>
                {this.state.orders.map((order, index) => (<OrderItem order={order} index={index}/>))}
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
      <div>
        <tr key={this.props.index}>
          <td>{this.props.order.orderID}</td>
          <td>{this.props.order.DIN}</td>
          <td>{this.props.order.buyer}</td>
          <td>{this.props.order.amountPaid}</td>
          <td>{this.props.order.date}</td>
        </tr>
      </div>
    );
  }
}

export default Orders;
