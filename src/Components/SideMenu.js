import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";

class SideMenu extends Component {
	showMarketplace() {
		console.log("Marketplace");
	}

	showPurchases() {
		console.log("Purchases")
	}

	showProducts() {
		console.log("Products")
	}

	showOrders() {
		console.log("Orders")
	}

	render() {
		const listItemStyle = { "color" : "white" }

		return (
			<List className="side-menu">
				<ListItem
					style={listItemStyle}
					primaryText="Marketplace"
					leftIcon={<Store color="white" />}
					onClick={this.showMarketplace.bind(this)}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Purchases"
					leftIcon={<ShoppingCart color="white" />}
					onClick={this.showPurchases.bind(this)}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Products"
					leftIcon={<Products color="white" />}
					onClick={this.showProducts.bind(this)}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Orders"
					leftIcon={<Money color="white" />}
					onClick={this.showOrders.bind(this)}
				/>
			</List>
		);
	}
}

export default SideMenu;