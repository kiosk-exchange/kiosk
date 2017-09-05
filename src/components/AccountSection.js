import React from "react";
import { ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Wallet from "material-ui/svg-icons/action/account-balance-wallet";
import blockies from "blockies";

const AccountSection = ({ account, KMT, ETH }) => {
	if (!account) {
		return <div />;
	}

	const icon = blockies({
		seed: account
	});

	const iconStyle = {
		width: "30px",
		height: "30px",
		borderRadius: "15px"
	};

	const style = {
		color: "white",
		fontSize: "15px",
		letterSpacing: "1px",
	};

	const accountStyle = {
		...style,
		overflow: "hidden",
  		maxWidth: "12ch"
	}

	const subheaderStyle = {
		color: "#9CA6AF",
		letterSpacing: "1px"
	};

	const formatted = balance => {
		return balance
			.toFixed(3)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	return (
		<div>
			<Subheader style={subheaderStyle}>ACCOUNT</Subheader>
			<ListItem
				style={accountStyle}
				disabled={true}
				primaryText={account}
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
				primaryText={KMT !== null ? formatted(KMT) + " KMT" : ""}
				leftIcon={KMT !== null ? <Wallet color="white" /> : null}
			/>
			<ListItem
				style={style}
				disabled={true}
				primaryText={ETH !== null ? formatted(ETH) + " ETH" : ""}
				leftIcon={ETH !== null ? <Wallet color="white" /> : null}
			/>
		</div>
	);
};

export default AccountSection;