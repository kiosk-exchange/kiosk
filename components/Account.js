// import React, { Component } from "react";
// import { getKioskMarketToken } from "../utils/contracts";
// import Subheader from "material-ui/Subheader";
// import Wallet from "material-ui/svg-icons/action/account-balance-wallet";
// import blockies from "blockies";

// class Account extends Component {


// 	render() {
// 		if (this.props.web3) {

// 		}
// 		return null
// 	}
// }



// function Account(props) {
	// if (props.web3) {

	// 	const icon = blockies({
	// 		seed: props.account
	// 	});

	// 	const iconStyle = {
	// 		width: "30px",
	// 		height: "30px",
	// 		borderRadius: "15px"
	// 	};

	// 	return (
	// 		<div>
	// 			<Subheader style={props.subheaderStyle}>ACCOUNT</Subheader>
	// 			<ListItem
	// 				style={props.style}
	// 				disabled={true}
	// 				primaryText={props.account.slice(0, 12)}
	// 				leftAvatar={
	// 					<img
	// 						src={icon.toDataURL()}
	// 						role="presentation"
	// 						style={iconStyle}
	// 					/>
	// 				}
	// 			/>
	// 			<ListItem
	// 				style={props.style}
	// 				disabled={true}
	// 				primaryText={this.state.KMTBalance}
	// 				leftIcon={<Wallet color="white" />}
	// 			/>
	// 			<ListItem
	// 				style={props.style}
	// 				disabled={true}
	// 				primaryText={this.state.ETHBalance}
	// 				leftIcon={<Wallet color="white" />}
	// 			/>
	// 		</div>
	// 	);
	// }
	// return null;
// }