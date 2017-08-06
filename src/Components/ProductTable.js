import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class ProductTable extends Component {

	render() {
		return (
			<div className="product-table">
				<Table striped bordered condensed hover>
					<tbody>
						<tr>
							<th>DIN</th>
							<th>Name</th>
							<th>Price</th>
							<th>Buy</th>
						</tr>
						{this.props.products.map((product, index) => (
								<tr key={index}>
									<td>
										<a href={"/DIN/" + product.DIN}>{product.DIN}</a>
									</td>
									<td>{product.name}</td>
									<td>{product.price}</td>
									<td>
										<button>Buy</button>
									</td>
								</tr>
							)
						)}
					</tbody>
				</Table>
			</div>
		)
	}

}

export default ProductTable
