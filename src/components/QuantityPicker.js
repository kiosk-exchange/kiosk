import React from "react";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import { selectedQuantity } from "../redux/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	selectedQuantity: state.buyModal.selectedQuantity
});

const mapDispatchToProps = dispatch => ({
	onQuantityChange: quantity => {
		dispatch(selectedQuantity(quantity));
	}
});

const QuantityPicker = ({ selectedQuantity, onQuantityChange, theme }) => {
	const items = [];
	for (let i = 1; i <= 10; i++) {
		let text = i.toString();

		if (i === 10) {
			text = text.concat(" +");
		}

		items.push(<MenuItem value={i} key={i} primaryText={`${text}`} />);
	}

	const handleQuantityChange = (event, index, value) => {
		console.log(value)
		onQuantityChange(value)
	}

	return (
		<DropDownMenu
			maxHeight={400}
			selectedMenuItemStyle={{ color: theme.blue }}
			value={selectedQuantity}
			onChange={handleQuantityChange}
		>
			{items}
		</DropDownMenu>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(QuantityPicker);