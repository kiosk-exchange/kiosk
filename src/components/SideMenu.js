import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, ListItem, makeSelectable } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";
import Avatar from "material-ui/Avatar";
import Wallet from "material-ui/svg-icons/action/account-balance-wallet";
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
				height: "100vh"
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

class AccountSection extends Component {
	render() {
		if (!this.props.account) {
			return <div />;
		}

		const icon = blockies({
			seed: this.props.account
		});

		const iconStyle = {
			width: "30px",
			height: "30px",
			borderRadius: "15px"
		};

		const formatted = balance => {
			return balance
				.toFixed(3)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};

		return (
			<div>
				<Subheader style={this.props.subheaderStyle}>ACCOUNT</Subheader>
				<ListItem
					style={this.props.style}
					disabled={true}
					primaryText={this.props.account.slice(0, 12)}
					leftAvatar={
						<img
							src={icon.toDataURL()}
							role="presentation"
							style={iconStyle}
						/>
					}
				/>
				<ListItem
					style={this.props.style}
					disabled={true}
					primaryText={formatted(this.props.KMTBalance) + " KMT"}
					leftIcon={<Wallet color="white" />}
				/>
				<ListItem
					style={this.props.style}
					disabled={true}
					primaryText={formatted(this.props.ETHBalance) + " ETH"}
					leftIcon={<Wallet color="white" />}
				/>
			</div>
		);
	}
}

class SideMenu extends Component {
	constructor(props) {
		super(props)
	}

	calculateSelectedIndex = () => {
		try {
			switch(this.props.location.pathname) {
				case "/":
				case "/marketplace":
					return 1
				case "/purchases":
					return 2
				case "/products":
					return 3
				case "/sales":
					return 4
			}
		} catch (e) {
			return 1
		}
	}

	render() {
		const style = {
			color: "white",
			fontSize: "15px",
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

		let accountSection = null;

		if (
			this.context.account !== null &&
			this.props.ETHBalance !== null &&
			this.props.KMTBalance !== null
		) {
			accountSection = (
				<AccountSection
					{...this.props}
					account={this.context.account}
					style={style}
					subheaderStyle={subheaderStyle}
				/>
			);
		}

		return (
			<SelectableList defaultValue={this.calculateSelectedIndex()}>
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
				{accountSection}
			</SelectableList>
		);
	}
}

SideMenu.contextTypes = {
	web3: PropTypes.object,
	account: PropTypes.string
};

export default SideMenu;
