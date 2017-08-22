import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentSend from "material-ui/svg-icons/content/send";
import ContentDrafts from "material-ui/svg-icons/content/drafts";

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
					leftIcon={<ContentInbox color="white" />}
					onClick={this.showMarketplace.bind(this)}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Purchases"
					leftIcon={<ActionGrade color="white" />}
					onClick={this.showPurchases.bind(this)}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Products"
					leftIcon={<ContentSend color="white" />}
					onClick={this.showProducts.bind(this)}
				/>
				<ListItem
					style={listItemStyle}
					primaryText="Orders"
					leftIcon={<ContentDrafts color="white" />}
					onClick={this.showOrders.bind(this)}
				/>
			</List>
		);
	}
}

export default SideMenu;