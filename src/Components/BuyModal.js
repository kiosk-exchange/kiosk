import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class BuyModal extends Component {
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
					<h2>Name</h2>
					<h6>DIN</h6>
					<h4>Quantity</h4>
					<h4>Total Price</h4>
				</Modal.Body>
				<Button className="buy-now" onClick={this.props.handleBuy}>Buy Now</Button>
			</Modal>
		);
	}
}

export default BuyModal;