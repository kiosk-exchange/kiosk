import React, { Component } from "react";
import { List, ListItem, makeSelectable } from "material-ui/List";
import AccountSection from "./AccountSection";
import Subheader from "material-ui/Subheader";
import Store from "material-ui/svg-icons/action/store";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import Products from "material-ui/svg-icons/action/loyalty";
import Money from "material-ui/svg-icons/editor/attach-money";
import Avatar from "material-ui/Avatar";
import { connect } from "react-redux";

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
	return class SelectableList extends Component {
		static propTypes = {
			children: React.PropTypes.node.isRequired,
			defaultValue: React.PropTypes.number.isRequired
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

const mapStateToProps = state => ({
	account: state.account
});

class SideMenu extends Component {
	render() {

		console.log(this.props.account)

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
				<AccountSection account={this.props.account}/>
			</SelectableList>
		);
	}
}

export default connect(mapStateToProps)(SideMenu);
