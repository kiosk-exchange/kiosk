import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import QuantityPicker from "./QuantityPicker";
import MarketJSON from "../../build/contracts/Market.json";
import { buyProduct } from "../utils/buy";

class BuyModal extends Component {
	constructor(props) {
		super(props);

		this.handleBuy = this.handleBuy.bind(this);
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
		const hidden = { display: "none" }
		const visible = { display: "block" }

		return (
			<Modal
				{...this.props}
				animation={false}
				bsSize="small"
				aria-labelledby="contained-modal-title-sm"
				className="buy-modal"
			>
				<Modal.Header closeButton />
				<Modal.Body>
					<h1>
						{this.props.product.name}
					</h1>
					<p>
						DIN: {this.props.product.DIN}
					</p>
					<QuantityPicker />
					<h3>
						Total Price: {this.price()}
					</h3>
				</Modal.Body>
				<Button style={this.props.product.available === true ? visible : hidden} className="buy-now" onClick={this.handleBuy}>
					Buy Now
				</Button>
				<Button style={this.props.product.available === false ? visible : hidden} className="not-available">
					Not Available
				</Button>
			</Modal>
		);
	}
}

export default BuyModal;