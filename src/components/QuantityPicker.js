import React, { Component } from "react";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import PropTypes from "prop-types";

const items = [];
for (let i = 1; i <= 10; i++) {
	let text = i.toString();

	// TODO:
	// if (i == 10) {
	// 	text = text.concat(" +")
	// }

	items.push(<MenuItem value={i} key={i} primaryText={`${text}`} />);
}

class QuantityPicker extends Component {
	constructor(props) {
		super(props);
		this.state = { value: 1 };
	}

	handleChange = (event, index, value) => {
		this.props.handleQuantityChange(value)
		this.setState({ value });
	}

	render() {
		return (
			<DropDownMenu
				maxHeight={400}
				selectedMenuItemStyle={{color: this.context.theme.blue}}
				value={this.state.value}
				onChange={this.handleChange}
			>
				{items}
			</DropDownMenu>
		);
	}
}

QuantityPicker.contextTypes = {
	theme: PropTypes.object
}

export default QuantityPicker;
