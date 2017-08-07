import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import TableRowButton from './TableRowButton'

class ProductTable extends Component {

	render() {
		return (
			<div className="product-table">
				<Table striped bordered condensed hover>
					<tbody>
						<tr>
							<th>DIN</th>
							<th>Name</th>
							<th>Node</th>
							<th>Price</th>
							<th>Buy</th>
						</tr>
						{this.props.products.map((product, index) => (
								<tr key={index}>
									<td>
										<a href={"/DIN/" + product.DIN}>{product.DIN}</a>
									</td>
									<td>{product.name}</td>
									<td>{product.node}</td>
									<td>{product.price}</td>
									<td>
										<TableRowButton title={"Buy Now"} index={index} handleBuy={this.props.handleBuy} />
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
