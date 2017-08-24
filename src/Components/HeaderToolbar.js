import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import blockies from "blockies";

class HeaderToolbar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			account: "",
			network: ""
		};
	}

	componentWillMount() {
		if (this.props.web3.eth.defaultAccount) {
			this.setState({ account: this.props.web3.eth.defaultAccount });
		} else {
			this.props.web3.eth.getAccounts((err, accounts) => {
				this.setState({ account: accounts[0] });
			});
		}

		this.props.web3.version.getNetwork((err, networkId) => {
			const network = this.getNetwork(networkId);
			this.setState({ network: network });
		});
	}

	getNetwork(networkId) {
		switch (networkId) {
			// MetaMask names and colors
			case "1":
				return {
					name: "Main Ethereum Network",
					color: "#05868A"
				};
			case "2":
				return {
					name: "Morden Test Network",
					color: "#FFFFFF"
				};
			case "3":
				return {
					name: "Ropsten Test Network",
					color: "#E71650"
				};
			case "4":
				return {
					name: "Rinkeby Test Network",
					color: "#EBB240"
				};
			case "42":
				return {
					name: "Kovan Test Network",
					color: "#6A0397"
				};
			default:
				return {
					name: "Private Network",
					color: this.context.kioskLightGray
				};
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
		const icon = blockies({
			seed: this.state.account
		});

		const accountStyle = {
			color: this.context.kioskGray,
			fontSize: "16px",
			fontWeight: "bold",
			letterSpacing: "1px",
			padding: "10px"
		};

		const networkStyle = {
			color: this.state.network.color,
			fontSize: "16px",
			fontWeight: "bold",
			letterSpacing: "1px",
			padding: "10px"
		};

		const toolbarStyle = {
			backgroundColor: "white",
			borderStyle: "solid",
			borderWidth: "1px",
			borderColor: "#E0E0E0"
		};

		const iconStyle = {
			width: "30px",
			height: "30px",
			borderRadius: "15px"
		};

		return (
			<Toolbar style={toolbarStyle}>
				<ToolbarGroup>
					<ToolbarTitle
						style={networkStyle}
						text={this.state.network.name}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<img src={icon.toDataURL()} role="presentation" style={iconStyle} />
					<ToolbarTitle
						style={accountStyle}
						text={this.truncated(this.state.account)}
					/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

HeaderToolbar.contextTypes = {
	kioskGray: PropTypes.string,
	kioskLightGray: PropTypes.string
};

export default HeaderToolbar;