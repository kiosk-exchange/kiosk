import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import MarketJSON from "../../build/contracts/Market.json";
import { buyProduct } from "../utils/buy";

class BuyModal extends Component {
	constructor(props) {
		super(props);

		this.handleBuy = this.handleBuy.bind(this)
	}

	handleBuy() {
		const DIN = this.props.product.DIN;
		const marketContract = this.props.web3.eth.contract(MarketJSON.abi);
		const market = marketContract.at(this.props.product.market);
		const priceInWei = market.price(this.props.product.DIN, 1);
		const buyer = this.props.web3.eth.accounts[0];
		buyProduct(DIN, 1, priceInWei, buyer, market);
	}

	price() {
		if (this.props.show === true) {
			return this.props.product.price + " ETH";
		}

		return "";
	}

	render() {
		return (
			<Modal
				{...this.props}
				bsSize="small"
				aria-labelledby="contained-modal-title-sm"
				className="buy-modal"
			>
				<Modal.Header closeButton />
				<Modal.Body>
					<h3>
						Name: {this.props.product.name}
					</h3>
					<h3>
						DIN: {this.props.product.DIN}
					</h3>
					<h3>Quantity: 1</h3>
					<h3>
						Total Price: {this.price()}
					</h3>
				</Modal.Body>
				<Button className="buy-now" onClick={this.handleBuy}>
					Buy Now
				</Button>
			</Modal>
		);
	}
}

export default BuyModal;