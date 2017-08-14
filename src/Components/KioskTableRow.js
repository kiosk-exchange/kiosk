import React, { Component } from "react";
import { Link } from "react-router-dom";

class KioskTableRow extends Component {
	render() {
		const product = this.props.product;
		return (
			<tr>
				{this.props.headers.map(header => {
					switch (header) {
						case "DIN":
							return (
								<td key={header}>
									<a
										href="#"
										onClick={() => this.props.handleSelectProduct(product)}
									>
										{product.DIN}
									</a>
								</td>
							);
						case "Product Name":
							return <KioskTableDetail key={header} detail={product.name} />;
						case "Seller":
							return <KioskTableDetail key={header} detail={product.owner} />;
						case "Market":
							return (
								<td key={header}>
									<Link to={`/market/${product.market}`}>
										{product.market}
									</Link>
								</td>
							);
						case "Price":
							return <KioskTableDetail key={header} detail={product.price} />;
						default:
							return <tr />;
					}
				})}
			</tr>
		);
	}
}

function KioskTableDetail(props) {
	return (
		<td>
			{props.detail}
		</td>
	);
}

export default KioskTableRow;
