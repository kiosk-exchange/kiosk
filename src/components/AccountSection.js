import React from "react";
import { ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Wallet from "material-ui/svg-icons/action/account-balance-wallet";
import blockies from "blockies";

const AccountSection = ({ account }) => {
	if (!account) {
		return <div />;
	}

	const icon = blockies({
		seed: account.address
	});

	const iconStyle = {
		width: "30px",
		height: "30px",
		borderRadius: "15px"
	};

	const style = {
		color: "white",
		fontSize: "15px",
		letterSpacing: "1px"
	};

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
				style={style}
				disabled={true}
				primaryText={account.address.slice(0, 12)}
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
				primaryText={formatted(account.KMT) + " KMT"}
				leftIcon={<Wallet color="white" />}
			/>
			<ListItem
				style={style}
				disabled={true}
				primaryText={formatted(account.ETH) + " ETH"}
				leftIcon={<Wallet color="white" />}
			/>
		</div>
	);
};

export default AccountSection;