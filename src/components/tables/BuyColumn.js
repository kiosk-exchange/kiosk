import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { TableRowColumn } from "material-ui/Table";
import { connect } from "react-redux";
import { selectProduct } from "../../redux/actions/actions";

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onBuyClick: () => {
			dispatch(selectProduct(ownProps.DIN));
		}
	};
};

const BuyColumn = ({ onBuyClick }) => {
	return (
		<TableRowColumn>
			<RaisedButton
				label="Buy"
				disabled={false}
				backgroundColor="#32C1FF"
				labelColor="#FFFFFF"
				onClick={onBuyClick}
			/>
		</TableRowColumn>
	);
};

export default connect(null, mapDispatchToProps)(BuyColumn);