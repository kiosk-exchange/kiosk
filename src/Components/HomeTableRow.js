import React, { Component } from "react";
import { Link } from "react-router-dom";

class HomeTableRow extends Component {
	render() {
		return (
			<h1 />
		)
}

export default HomeTableRow;

// <tr key={product.DIN}>
// 	<td>
// 		<a href="#" onClick={() => this.props.handleSelectProduct(product)}>
// 			{product.DIN}
// 		</a>
// 	</td>
// 	<td>
// 		{product.name}
// 	</td>
// 	<td>
// 		{product.owner}
// 	</td>
// 	<td>
// 		<Link to={`/market/${product.market}`}>
// 			{product.market}
// 		</Link>
// 	</td>
// </tr>;