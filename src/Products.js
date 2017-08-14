import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { getUserDINs, infoFromDIN } from "./utils/getProducts";
import KioskTable from "./Components/KioskTable";

class Products extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null,
			products: []
		};
	}

	componentWillMount() {
		getWeb3.then(results => {
			this.setState({ web3: results.web3 }, () => {
				// Get the global DIN registry
				getDINRegistry(this.state.web3).then(registry => {
					this.setState({ DINRegistry: registry }, () => {
						this.getProducts();
					});
				});
			});
		});
	}

	getProducts() {
		console
		getUserDINs(
			this.state.DINRegistry,
			this.state.web3.eth.coinbase
		).then(DINs => {
			// Get product details (name, node, price) from the market
			var fullProducts = DINs.map(DIN => {
				return infoFromDIN(DIN, this.state.web3, this.state.DINRegistry);
			});

			this.setState({ products: fullProducts });
		});
	}

	render() {
		return (
			<div className="product-table-container">
				<div className="product-table-header">
					<h1 className="product-table-header-title">Products</h1>
				</div>
				<div className="product-table">
					<KioskTable
						headers={["DIN", "Product Name", "Price"]}
						products={this.state.products}
						handleSelectProduct={this.handleSelectProduct}
					/>
				</div>
			</div>
		);
	}
}

export default Products;