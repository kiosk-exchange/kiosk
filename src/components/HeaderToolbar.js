import React, { Component } from "react";
import PropTypes from "prop-types";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import RaisedButton from "material-ui/RaisedButton";

class HeaderToolbar extends Component {
	render() {
		const networkStyle = {
			color: this.context.network.color,
			fontSize: "16px",
			fontWeight: "bold",
			letterSpacing: "1px",
			padding: "10px"
		};

		const toolbarStyle = {
			backgroundColor: "white",
			borderStyle: "solid",
			borderWidth: "1px",
			borderColor: "#E0E0E0"
		};

		return (
			<Toolbar style={toolbarStyle}>
				<ToolbarGroup>
					<ToolbarTitle
						style={networkStyle}
						text={this.context.network.name ? this.context.network.name : ""}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<RaisedButton
						label="Buy Kiosk Market Token"
						backgroundColor={this.context.theme.red}
						disabled={this.props.isError}
						labelColor="#FFFFFF"
						onClick={this.props.handleBuyKMTClick}
					/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

HeaderToolbar.contextTypes = {
	web3: PropTypes.object,
	network: PropTypes.object,
	theme: PropTypes.object
};

export default HeaderToolbar;
