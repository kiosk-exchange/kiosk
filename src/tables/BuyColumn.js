import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import { TableRowColumn } from "material-ui/Table";

class BuyColumn extends Component {
	render() {
		return (
			<TableRowColumn>
				<RaisedButton
					label="Buy"
					disabled={!this.props.product.available}
					backgroundColor="#32C1FF"
					labelColor="#FFFFFF"
					onClick={() => this.props.handleBuy(this.props.product)}
				/>
			</TableRowColumn>
		);
	}
}

export default BuyColumn;