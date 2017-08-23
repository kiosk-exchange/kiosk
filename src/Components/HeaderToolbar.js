import React, { Component } from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";

class HeaderToolbar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			account: this.props.web3.eth.defaultAccount || this.props.web3.eth.accounts[0]
		}
	}

	render() {
		return (
			<Toolbar style={{ backgroundColor: "white" }}>
				<ToolbarGroup>
					<ToolbarTitle text="Kovan Test Network" />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarTitle text={this.state.account} />
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

export default HeaderToolbar;