import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import './Orders.css'

class Orders extends Component {

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