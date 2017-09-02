import React, { Component } from "react";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

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
		const { theme } = this.props

		return (
			<DropDownMenu
				maxHeight={400}
				selectedMenuItemStyle={{color: theme.blue}}
				value={this.state.value}
				onChange={this.handleChange}
			>
				{items}
			</DropDownMenu>
		);
	}
}

export default QuantityPicker;
