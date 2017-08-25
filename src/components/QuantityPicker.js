import React, { Component } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

class QuantityPicker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			quantity: 1
		};

		this.handleQuantityChange = this.handleQuantityChange.bind(this);
	}

	handleQuantityChange(eventKey) {
		this.props.handleQuantityChange(eventKey)
		this.setState({ quantity: eventKey });
	}

	render() {
		const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		return (
			<DropdownButton
				id={this.state.quantity}
				title={this.state.quantity}
				onSelect={this.handleQuantityChange}
			>
				{options.map(option => {
					return (
						<MenuItem key={option} eventKey={option}>
							{option}
						</MenuItem>
					);
				})}
			</DropdownButton>
		);
	}
}

export default QuantityPicker;