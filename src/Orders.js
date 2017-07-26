import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import getWeb3 from './utils/getWeb3'

import publicProductABI from '../build/contracts/PublicProduct.json'
const contract = require('truffle-contract')

import './Orders.css'

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

      this.setState({ publicProduct: instance.contract })

      // var buyer = this.state.web3.eth.coinbase

      // Add order event listener
      var newOrderEventAll = instance.contract.NewOrder({fromBlock: 0, toBlock: 'latest'});
			newOrderEventAll.watch((error, result) => {
	  		if (!error) {
	  			// Add to UI
	  			console.log(result)
	  		} else {
	  			console.log(error)
	  		}
			})
    })
  }


	render() {
		return (
			<div>
				<h1>Orders</h1>
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
		);
  }

}

export default Orders;