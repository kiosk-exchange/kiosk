import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import Subheader from 'material-ui/Subheader';
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";

class SideMenu extends Component {
	render() {
		const style = { color: "white", "letterSpacing": "1px" };
		const subheaderStyle = { color: "#9CA6AF", "letterSpacing": "1px" }

		return (
			<List className="side-menu">
				<Subheader style={subheaderStyle}>BUY</Subheader>
				<ListItem
					style={style}
					primaryText="Markets"
					leftIcon={<Store color="white" />}
					onClick={() =>
						this.props.handleSelectListItem("marketplace")}
				/>
				<ListItem
					style={style}
					primaryText="Purchases"
					leftIcon={<ShoppingCart color="white" />}
					onClick={() => this.props.handleSelectListItem("purchases")}
				/>
				<Subheader style={subheaderStyle}>SELL</Subheader>
				<ListItem
					style={style}
					primaryText="Products"
					leftIcon={<Products color="white" />}
					onClick={() => this.props.handleSelectListItem("products")}
				/>
				<ListItem
					style={style}
					primaryText="Sales"
					leftIcon={<Money color="white" />}
					onClick={() => this.props.handleSelectListItem("sales")}
				/>
			</List>
		);
	}
}

export default SideMenu;