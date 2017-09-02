import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import { TableRowColumn } from "material-ui/Table";
import { connect } from "react-redux";
import { showBuyModal } from "../redux/actions";

mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: (ownProps.product) => {
		dispatch(showBuyModal(product))
	}
})

class BuyColumn extends Component {
	render() {
		const { product, onClick } = this.props

		return (
			<TableRowColumn>
				<RaisedButton
					label="Buy"
					disabled={false}
					backgroundColor="#32C1FF"
					labelColor="#FFFFFF"
					// onClick={() => this.props.handleBuyClick(this.props.product)}
				/>
			</TableRowColumn>
		);
	}
}

export default connect(null, mapDispatchToProps)(BuyColumn);