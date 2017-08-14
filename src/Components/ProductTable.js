import React, { Component } from "react";
import { Table } from "react-bootstrap";
import TableRowButton from "./TableRowButton";

class ProductTable extends Component {
	render() {
		return (
			<div className="product-table">
				<Table striped bordered condensed hover>
					<tbody>
						<tr>
							<th>DIN</th>
							<th>Name</th>
							<th>Price (in Ether)</th>
							<th>Status</th>
						</tr>
						{this.props.products.map((product, index) =>
							<tr key={index}>
								<td>
									{product.DIN}
								</td>
								<td>
									{product.name}
								</td>
								<td>
									{product.formattedPrice}
								</td>
								<td>
									<TableRowButton
										available={product.available}
										index={index}
										handleBuy={this.props.handleBuy}
									/>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default ProductTable;