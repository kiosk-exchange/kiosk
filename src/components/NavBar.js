import React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import RaisedButton from "material-ui/RaisedButton";
import { buyKioskMarketToken } from "../redux/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	theme: state.config.theme
})

const mapDispatchToProps = dispatch => ({
	onBuyClick: () => {
		dispatch(buyKioskMarketToken())
	}
})

const NavBar = ({ theme, network, isError, onBuyClick }) => {
	const networkStyle = {
		// color: network.color ? "white" : "white",
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
					// text={
					// 	network.name
					// 		? network.name
					// 		: ""
					// }
				/>
			</ToolbarGroup>
			<ToolbarGroup>
				<RaisedButton
					label="Buy Kiosk Market Token"
					backgroundColor={theme.red}
					disabled={isError}
					labelColor="#FFFFFF"
					onClick={onBuyClick}
				/>
			</ToolbarGroup>
		</Toolbar>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);