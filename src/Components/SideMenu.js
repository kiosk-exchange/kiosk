import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentSend from "material-ui/svg-icons/content/send";
import ContentDrafts from "material-ui/svg-icons/content/drafts";

class SideMenu extends Component {
	render() {
		return (
			<List className="side-menu">
				<ListItem primaryText="Marketplace" leftIcon={<ContentInbox />} />
				<ListItem primaryText="Purchases" leftIcon={<ActionGrade />} />
				<ListItem primaryText="Products" leftIcon={<ContentSend />} />
				<ListItem primaryText="Orders" leftIcon={<ContentDrafts />} />
			</List>
		);
	}
}

export default SideMenu;