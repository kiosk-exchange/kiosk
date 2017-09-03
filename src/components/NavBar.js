import React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import RaisedButton from "material-ui/RaisedButton";
import { buyKioskMarketToken } from "../redux/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	network: state.config.network,
	theme: state.config.theme
})

const mapDispatchToProps = dispatch => ({
	onBuyClick: () => {
		dispatch(buyKioskMarketToken())
	}
})

const NavBar = ({ theme, network, onBuyClick }) => {
	const networkStyle = {
		color: network ? network.color : theme.lightGray,
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
					text={network ? network.name : "Not Connected"}
				/>
			</ToolbarGroup>
			<ToolbarGroup>
				<RaisedButton
					label="Buy Kiosk Market Token"
					backgroundColor={theme.red}
					disabled={network ? false : true}
					labelColor="#FFFFFF"
					onClick={onBuyClick}
				/>
			</ToolbarGroup>
		</Toolbar>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);