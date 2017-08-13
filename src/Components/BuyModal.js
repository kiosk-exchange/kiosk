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
					<h3>Name:</h3>
					<h3>DIN:</h3>
					<h3>Quantity:</h3>
					<h3>Total Price:</h3>
				</Modal.Body>
				<Button className="buy-now" onClick={this.props.handleBuy}>Buy Now</Button>
			</Modal>
		);
	}
}

export default BuyModal;