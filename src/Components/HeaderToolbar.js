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
			this.setState({ account: this.props.web3.eth.defaultAccount });
		} else {
			this.props.web3.eth.getAccounts((err, accounts) => {
				this.setState({ account: accounts[0] });
			});
		}

		this.props.web3.version.getNetwork((err, networkId) => {
			const network = this.networkName(networkId)
			this.setState({ network: network });
		});
	}

	networkName(networkId) {
		switch (networkId) {
			case "1":
				return "Main Ethereum Network";
			case "2":
				return "Morden Test Network";
			case "3":
				return "Ropsten Test Network";
			case "42":
				return "Kovan Test Network";
			default:
				return "Private Network";
		}
	}

	truncated(account) {
		// Ethereum account 0x...
		if (account.length === 42) {
			return account.slice(0, 12);
		}
		return "";
	}

	render() {
		const style = {
			color: this.context.kioskGray,
			fontSize: "16px",
			fontWeight: "bold",
			letterSpacing: "1px"
		};

		return (
			<Toolbar style={{ backgroundColor: "white" }}>
				<ToolbarGroup>
					<ToolbarTitle style={style} text={this.state.network} />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarTitle
						style={style}
						text={this.truncated(this.state.account)}
					/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

HeaderToolbar.contextTypes = {
	kioskGray: React.PropTypes.string
};

export default HeaderToolbar;