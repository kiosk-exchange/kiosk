import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import getWeb3 from './utils/getWeb3'

import publicProductABI from '../build/contracts/PublicProduct.json'
const contract = require('truffle-contract')

class Orders extends Component {

  constructor(props) {
    super(props)

    this.state = {
    web3: null,
    publicProduct: null
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
      web3: results.web3,
    })

      this.initializePublicProduct()
    })
  }

  initializePublicProduct() {
    const publicProduct = contract(publicProductABI)
    publicProduct.setProvider(this.state.web3.currentProvider)
    publicProduct.deployed().then((instance) => {
      this.setState({ publicProduct: instance.contract }, () => {
        this.getOrders()
      })
    })
  }

  getOrders() {
    var buyer = this.state.web3.eth.coinbase
    // Add order event listener
    var newOrderEventAll = this.state.publicProduct.NewOrder({buyer: buyer}, {fromBlock: 0, toBlock: 'latest'})
    newOrderEventAll.watch((error, result) => {
      console.log("YES")
      if (!error) {
      // Add to UI
        console.log(result)
      } else {
        console.log(error)
      }
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
    					<tr>
    						<th>Transaction ID</th>
    						<th>Product</th>
    						<th>Date</th>
    					</tr>

    					<tbody>
    						<tr>
    							<td>1</td>
    							<td>Blue T-Shirt</td>
    							<td>July 21, 2017</td>
    						</tr>
    					</tbody>
    				</Table>
          </div>

        </div>

			</div>
      
		);
  }

}

export default Orders;