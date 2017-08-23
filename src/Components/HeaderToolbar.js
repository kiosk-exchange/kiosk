import React, { Component } from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";

class HeaderToolbar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			account: "",
			network: ""
		};
	}

	componentWillMount() {
		var network;

		if (this.props.web3.eth.defaultAccount) {
			this.setState({ account: this.props.web3.eth.defaultAccount})
		} else {
			this.props.web3.eth.getAccounts((err, accounts) => {
				this.setState({ account: accounts[0] })
			})
		}

		this.props.web3.version.getNetwork((err, networkId) => {
			switch (networkId) {
				case "1":
					network = "Main Ethereum Network";
					break;
				case "2":
					network = "Morden Test Network";
					break;
				case "3":
					network = "Ropsten Test Network";
					break;
				case "42":
					network = "Kovan Test Network";
					break;
				default:
					network = "Private Network";
					break;
			}
			this.setState({ network: network });
		});
	}

	truncated(account) {
		// Ethereum account 0x...
		if (account.length === 42) {
			return account.slice(0, 12);
		}
		return "";
	}

	render() {
		return (
			<Toolbar style={{ backgroundColor: "white" }}>
				<ToolbarGroup>
					<ToolbarTitle text={this.state.network} />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarTitle text={this.truncated(this.state.account)} />
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

export default HeaderToolbar;