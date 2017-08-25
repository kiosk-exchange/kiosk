import React, { Component } from "react";
import PropTypes from "prop-types";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import RaisedButton from "material-ui/RaisedButton";

class HeaderToolbar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			account: "",
			network: ""
		};
	}

	componentWillMount() {
		if (this.context.web3.eth.defaultAccount) {
			this.setState({ account: this.context.web3.eth.defaultAccount });
		} else {
			this.context.web3.eth.getAccounts((err, accounts) => {
				this.setState({ account: accounts[0] });
			});
		}

		this.context.web3.version.getNetwork((err, networkId) => {
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

	render() {
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

		return (
			<Toolbar style={toolbarStyle}>
				<ToolbarGroup>
					<ToolbarTitle
						style={networkStyle}
						text={this.state.network.name}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<RaisedButton
						label="Buy Kiosk Market Token"
						backgroundColor={this.context.kioskRed}
						labelColor="#FFFFFF"
						onClick={this.props.handleBuyKMTClick}
					/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

HeaderToolbar.contextTypes = {
	web3: PropTypes.object,
	kioskRed: PropTypes.string,
	kioskGray: PropTypes.string,
	kioskLightGray: PropTypes.string
};

export default HeaderToolbar;