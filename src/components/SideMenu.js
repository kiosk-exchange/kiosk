import React from "react";
import { List, ListItem } from "material-ui/List";
import AccountSection from "./AccountSection";
import Subheader from "material-ui/Subheader";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";
import Avatar from "material-ui/Avatar";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	account: state.account,
	KMT: state.KMTBalance,
	ETH: state.ETHBalance
});

const SideMenu = ({ account, KMT, ETH }) => {
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

	const headers = ["Markets", "Purchases", "Products", "Sales"];
	const icons = [
		<Store color="white" />,
		<ShoppingCart color="white" />,
		<Products color="white" />,
		<Money color="white" />
	];

	let listItems = [];
	for (var i = 0; i < headers.length; i++) {
		const listItem = (
			<ListItem
				value={i + 1}
				{...listItemStyle}
				primaryText={headers[i]}
				leftIcon={icons[i]}
				// onClick={() => this.props.history.push("/products")}
			/>
		);
		listItems.push(listItem);
	}

	return (
		<List style={listStyle}>
			<ListItem
				style={logoStyle}
				disabled={true}
				primaryText="kiosk"
				leftAvatar={<Avatar src="favicon.png" backgroundColor="none" />}
			/>
			<br />
			<Subheader style={subheaderStyle}>BUY</Subheader>
			{listItems[0]}
			{listItems[1]}
			<Subheader style={subheaderStyle}>SELL</Subheader>
			{listItems[2]}
			{listItems[3]}
			<AccountSection account={account} KMT={KMT} ETH={ETH} />
		</List>
	);
};

export default connect(mapStateToProps)(SideMenu);