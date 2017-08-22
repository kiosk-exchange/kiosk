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
		return (
			<List className="side-menu">
				<ListItem
					primaryText="Marketplace"
					leftIcon={<ContentInbox />}
					onClick={this.showMarketplace.bind(this)}
				/>
				<ListItem
					primaryText="Purchases"
					leftIcon={<ActionGrade />}
					onClick={this.showPurchases.bind(this)}
				/>
				<ListItem
					primaryText="Products"
					leftIcon={<ContentSend />}
					onClick={this.showProducts.bind(this)}
				/>
				<ListItem
					primaryText="Orders"
					leftIcon={<ContentDrafts />}
					onClick={this.showOrders.bind(this)}
				/>
			</List>
		);
	}
}

export default SideMenu;