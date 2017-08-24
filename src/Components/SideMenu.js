import React, { Component } from "react";
import { List, ListItem, makeSelectable } from "material-ui/List";
import PropTypes from "prop-types";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";
import Wallet from "material-ui/svg-icons/action/account-balance-wallet";

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
	render() {
		const style = {
			color: "white",
			letterSpacing: "1px"
		};

		const subheaderStyle = {
			color: "#9CA6AF",
			letterSpacing: "1px"
		};

		const buttonStyle = {
			position: "absolute",
			bottom: "50px",
			width: "170px",
			left: "40px"
		};

		return (
			<SelectableList defaultValue={1}>
				<Subheader style={subheaderStyle}>BUY</Subheader>
				<ListItem
					value={1}
					style={style}
					primaryText="Markets"
					leftIcon={<Store color="white" />}
					onClick={() =>
						this.props.handleSelectListItem("marketplace")}
				/>
				<ListItem
					value={2}
					style={style}
					primaryText="Purchases"
					leftIcon={<ShoppingCart color="white" />}
					onClick={() => this.props.handleSelectListItem("purchases")}
				/>
				<Subheader style={subheaderStyle}>SELL</Subheader>
				<ListItem
					value={3}
					style={style}
					primaryText="Products"
					leftIcon={<Products color="white" />}
					onClick={() => this.props.handleSelectListItem("products")}
				/>
				<ListItem
					value={4}
					style={style}
					primaryText="Sales"
					leftIcon={<Money color="white" />}
					onClick={() => this.props.handleSelectListItem("sales")}
				/>
				<Subheader style={subheaderStyle}>ACCOUNT</Subheader>
				<ListItem 
					style={style}
					disabled={true}
					primaryText="0.000 KMT"
					leftIcon={<Wallet color="white" />}
				/>
				<ListItem 
					style={style}
					disabled={true}
					primaryText="0.000 ETH"
					leftIcon={<Wallet color="white" />}
				/>
				<RaisedButton
					style={buttonStyle}
					label="Buy KMT"
					backgroundColor={this.context.kioskRed}
					labelColor="#FFFFFF"
					onClick={this.props.handleBuyKMTClick}
				/>
			</SelectableList>
		);
	}
}

SideMenu.contextTypes = {
	kioskRed: PropTypes.string
	// kioskGray: PropTypes.string,
	// kioskLightGray: PropTypes.string
};

export default SideMenu;