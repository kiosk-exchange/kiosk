import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";

class SideMenu extends Component {
	render() {
		const listItemStyle = { color: "white" };

		return (
			<List className="side-menu">
				<ListItem
					style={listItemStyle}
					primaryText="Marketplace"
					leftIcon={<Store color="white" />}
					onClick={() =>
						this.props.handleSelectListItem("marketplace")}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Purchases"
					leftIcon={<ShoppingCart color="white" />}
					onClick={() => this.props.handleSelectListItem("purchases")}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Products"
					leftIcon={<Products color="white" />}
					onClick={() => this.props.handleSelectListItem("products")}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Orders"
					leftIcon={<Money color="white" />}
					onClick={() => this.props.handleSelectListItem("orders")}
				/>
			</List>
		);
	}
}

export default SideMenu;