import React from "react";
import { List, ListItem, makeSelectable } from "material-ui/List";
import AccountSection from "./AccountSection";
import Subheader from "material-ui/Subheader";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";
import Avatar from "material-ui/Avatar";
import { connect } from "react-redux";
import { selectMenuItem } from "../redux/actions/actions";

const mapStateToProps = (state, ownProps) => ({
	account: state.config.account,
	KMT: state.config.KMTBalance,
	ETH: state.config.ETHBalance,
});

const mapDispatchToProps = dispatch => ({
	onMenuItemClick: id => {
		dispatch(selectMenuItem(id));
	}
});

const SelectableList = makeSelectable(List);

const SideMenu = ({ value, account, KMT, ETH, dataType, onMenuItemClick, id, filter }) => {
	const style = {
		color: "white",
		fontSize: "15px",
		letterSpacing: "1px"
	};

	const logoStyle = {
		color: "white",
		fontSize: "26px",
		fontWeight: "bold",
		letterSpacing: "2px"
	};

	const subheaderStyle = {
		color: "#9CA6AF",
		letterSpacing: "1px"
	};

	const listStyle = {
		backgroundColor: "#2C363F",
		height: "100vh"
	};

	const listItemStyle = {
		hoverColor: "#32C1FF",
		style: style
	};

	return (
		<SelectableList style={listStyle} value={value}>
			<ListItem
				style={logoStyle}
				disabled={true}
				primaryText="kiosk"
				leftAvatar={<Avatar src={require("./favicon.png")} backgroundColor="none" />}
			/>
			<br />
			<Subheader style={subheaderStyle}>BUY</Subheader>
			<ListItem
				value={1}
				{...listItemStyle}
				primaryText="Marketplace"
				leftIcon={<Store color="white" />}
				onClick={() => onMenuItemClick(1)}
			/>
			<ListItem
				value={2}
				{...listItemStyle}
				primaryText="Purchases"
				leftIcon={<ShoppingCart color="white" />}
				onClick={() => onMenuItemClick(2)}
			/>
			<Subheader style={subheaderStyle}>SELL</Subheader>
			<ListItem
				value={3}
				{...listItemStyle}
				primaryText="Products"
				leftIcon={<Products color="white" />}
				onClick={() => onMenuItemClick(3)}
			/>
			<ListItem
				value={4}
				{...listItemStyle}
				primaryText="Sales"
				leftIcon={<Money color="white" />}
				onClick={() => onMenuItemClick(4)}
			/>
			<AccountSection account={account} KMT={KMT} ETH={ETH} />
		</SelectableList>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);