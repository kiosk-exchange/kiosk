import React, { Component } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

class QuantityPicker extends Component {
	render() {
		const options = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
		return (
			<DropdownButton title="Quantity">
				{options.map(option => {
					return (
						<MenuItem eventKey={option}>
							{option}
						</MenuItem>
					);
				})}
			</DropdownButton>
		);
	}
}

export default QuantityPicker;