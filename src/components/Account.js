import React, { Component } from "react";
import { ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Wallet from "material-ui/svg-icons/action/account-balance-wallet";
import blockies from "blockies";

class Account extends Component {
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