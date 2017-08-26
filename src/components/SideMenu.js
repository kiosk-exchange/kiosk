import React, { Component } from "react";
import PropTypes from "prop-types";
// import { getEtherBalance, getKMTBalance } from "../utils/contracts";
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

function BuySection(props) {
	return (
		<div>
			<Subheader style={props.subheaderStyle}>BUY</Subheader>
			<ListItem
				value={1}
				style={props.style}
				hoverColor="#32C1FF"
				primaryText="Markets"
				leftIcon={<Store color="white" />}
				onClick={() => props.history.push("/marketplace")}
			/>
			<ListItem
				value={2}
				style={props.style}
				hoverColor="#32C1FF"
				primaryText="Purchases"
				leftIcon={<ShoppingCart color="white" />}
				onClick={() => props.history.push("/purchases")}
			/>
		</div>
	);
}

function SellSection(props) {
	return (
		<div>
			<Subheader style={props.subheaderStyle}>SELL</Subheader>
			<ListItem
				value={3}
				style={props.style}
				hoverColor="#32C1FF"
				primaryText="Products"
				leftIcon={<Products color="white" />}
				onClick={() => props.history.push("/products")}
			/>
			<ListItem
				value={4}
				style={props.style}
				hoverColor="#32C1FF"
				primaryText="Sales"
				leftIcon={<Money color="white" />}
				onClick={() => props.history.push("/sales")}
			/>
		</div>
	);
}

class AccountSection extends Component {
	render() {
		if (this.props.web3) {
			const icon = blockies({
				seed: this.props.account
			});

			const iconStyle = {
				width: "30px",
				height: "30px",
				borderRadius: "15px"
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
						primaryText="0.000 KMT"
						leftIcon={<Wallet color="white" />}
					/>
					<ListItem
						style={this.props.style}
						disabled={true}
						primaryText="0.000 ETH"
						leftIcon={<Wallet color="white" />}
					/>
				</div>
			);
		}
		return null;
	}
}

class SideMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			KMTBalance: null,
			ETHBalance: null
		};
	}

	componentWillMount() {
		// getEtherBalance(this.context.web3, this.context.account).then(result => {
		// 	console.log(result)
		// });


		// getKMTBalance(this.context.web3, this.context.account).then(result => {
		// 	console.log(result)
		// })
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
				<BuySection {...this.props} style={style} subheaderStyle={subheaderStyle} />
				<SellSection {...this.props} style={style} subheaderStyle={subheaderStyle}/>
				<AccountSection {...this.props} web3={this.context.web3} account={this.context.account} style={style} subheaderStyle={subheaderStyle} />
			</SelectableList>
		);
	}
}

SideMenu.contextTypes = {
	web3: PropTypes.object,
	account: PropTypes.string,
};

export default SideMenu;