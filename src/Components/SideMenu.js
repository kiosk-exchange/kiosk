import React, { Component } from "react";
import PropTypes from "prop-types";
import { getKioskMarketToken } from "../utils/contracts";
import { List, ListItem, makeSelectable } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";
import Wallet from "material-ui/svg-icons/action/account-balance-wallet";
import Avatar from "material-ui/Avatar";
import blockies from "blockies";

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
	return class SelectableList extends Component {
		static propTypes = {
			children: PropTypes.node.isRequired,
			defaultValue: PropTypes.number.isRequired
		};

		componentWillMount() {
			this.setState({
				selectedIndex: this.props.defaultValue
			});
		}

		handleRequestChange = (event, index) => {
			this.setState({
				selectedIndex: index
			});
		};

		render() {
			const listStyle = {
				backgroundColor: "#2C363F",
				width: "250px",
				height: "100vh",
				display: "inline-table"
			};
			return (
				<ComposedComponent
					style={listStyle}
					value={this.state.selectedIndex}
					onChange={this.handleRequestChange}
				>
					{this.props.children}
				</ComposedComponent>
			);
		}
	};
}

SelectableList = wrapState(SelectableList);

class SideMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			KMTBalance: null,
			ETHBalance: null
		};
	}

	componentWillMount() {
		this.getEtherBalance();
		this.getKMTBalance();
	}

	getEtherBalance() {
		this.context.web3.eth.getBalance(
			this.context.account,
			(err, result) => {
				const formattedBalance = this.formattedBalance(result) + " ETH";
				this.setState({ ETHBalance: formattedBalance });
			}
		);
	}

	getKMTBalance() {
		getKioskMarketToken(this.context.web3).then(KMT => {
			KMT.balanceOf(this.context.account, (err, result) => {
				const formattedBalance = this.formattedBalance(result) + " KMT";
				this.setState({ KMTBalance: formattedBalance });
			});
		});
	}

	formattedBalance(wei) {
		return this.context.web3
			.fromWei(wei, "ether")
			.toNumber()
			.toFixed(3)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	render() {
		const icon = blockies({
			seed: this.context.account
		});

		const iconStyle = {
			width: "30px",
			height: "30px",
			borderRadius: "15px"
		};

		const style = {
			color: "white",
			fontSize: "14px",
			letterSpacing: "1px"
		};

		const logoStyle = {
			color: "white",
			fontSize: "26px",
			fontWeight: "bold",
			letterSpacing: "2px"
		};

		const subheaderStyle = {
			color: "#9CA6AF",
			letterSpacing: "1px"
		};

		return (
			<SelectableList defaultValue={1}>
				<ListItem
					style={logoStyle}
					disabled={true}
					primaryText="kiosk"
					leftAvatar={
						<Avatar src="favicon.png" backgroundColor="none" />
					}
				/>
				<br />
				<Subheader style={subheaderStyle}>BUY</Subheader>
				<ListItem
					value={1}
					style={style}
					hoverColor="#32C1FF"
					primaryText="Markets"
					leftIcon={<Store color="white" />}
					onClick={() => this.props.history.push("/marketplace")}
				/>
				<ListItem
					value={2}
					style={style}
					hoverColor="#32C1FF"
					primaryText="Purchases"
					leftIcon={<ShoppingCart color="white" />}
					onClick={() => this.props.history.push("/purchases")}
				/>
				<Subheader style={subheaderStyle}>SELL</Subheader>
				<ListItem
					value={3}
					style={style}
					hoverColor="#32C1FF"
					primaryText="Products"
					leftIcon={<Products color="white" />}
					onClick={() => this.props.history.push("/products")}
				/>
				<ListItem
					value={4}
					style={style}
					hoverColor="#32C1FF"
					primaryText="Sales"
					leftIcon={<Money color="white" />}
					onClick={() => this.props.history.push("/sales")}
				/>
				<Subheader style={subheaderStyle}>ACCOUNT</Subheader>
				<ListItem
					style={style}
					disabled={true}
					primaryText={this.context.account.slice(0, 12)}
					leftAvatar={
						<img
							src={icon.toDataURL()}
							role="presentation"
							style={iconStyle}
						/>
					}
				/>
				<ListItem
					style={style}
					disabled={true}
					primaryText={this.state.KMTBalance}
					leftIcon={<Wallet color="white" />}
				/>
				<ListItem
					style={style}
					disabled={true}
					primaryText={this.state.ETHBalance}
					leftIcon={<Wallet color="white" />}
				/>
			</SelectableList>
		);
	}
}

SideMenu.contextTypes = {
	web3: PropTypes.object,
	account: PropTypes.string,
	kioskRed: PropTypes.string
};

export default SideMenu;