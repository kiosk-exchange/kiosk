import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import { connect } from "react-redux";
import { push } from "react-router-redux";

const mapStateToProps = state => {
	return {
		theme: state.config.theme
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onButtonClick: () => {
			dispatch(push("/marketplace"))
		}
	}
}

class Landing extends Component {
	render() {
		const { theme, onButtonClick } = this.props;

		const containerStyle = {
			display: "flex",
			flexDirection: "vertical",
			padding: "10px 50px",
			alignItems: "center"
		};

		const navStyle = {
			display: "flex",
			width: "100%",
			height: "60px",
			justifyContent: "flex-end"
		};

		const labelStyle = {
			color: theme.gray,
			fontWeight: "bold",
			fontSize: "20px",
			fontFamily: "Interface, sans-serif",
			letterSpacing: "1px"
		};

		const buttonStyle = {
			display: "inline-block",
			color: "white",
			backgroundColor: theme.red,
			margin: "0 10px 0 0",
			padding: "12px 40px",
			fontSize: "20px",
			fontFamily: "Interface, sans-serif",
			lineHeight: "1.8",
			appearance: "none",
			boxShadow: "none",
			borderRadius: 5,
			border: "none",
			fontWeight: "bold",
			letterSpacing: "3px"
		};

		return (
			<div>
				<div style={containerStyle}>
					<div style={{ display: "flex" }}>
						<img
							style={{
								height: "50px",
								width: "50px",
								paddingRight: "10px",
							}}
							src="favicon.png"
							role="presentation"
						/>
						<p
							style={{
								color: theme.gray,
								fontSize: "40px",
								fontWeight: "800",
								fontFamily: "Interface, sans-serif",
								margin: "auto",
								letterSpacing: "1px"
							}}
						>
							kiosk
						</p>
					</div>
					<div style={navStyle}>
						<div style={{paddingTop: "15px"}}>
							<FlatButton
								style={{ padding: "0px 10px" }}
								label="Documentation"
								labelStyle={labelStyle}
								onClick={() => {
									window.open(
										"https://kioskprotocol.gitbooks.io/kiosk/content/"
									);
								}}
							/>
							<FlatButton
								style={{ padding: "0px 10px" }}
								label="Github"
								labelStyle={labelStyle}
								onClick={() => {
									window.open(
										"https://github.com/kioskprotocol/kiosk"
									);
								}}
							/>
							<FlatButton
								style={{ padding: "0px 10px" }}
								label="Slack"
								labelStyle={labelStyle}
								onClick={() => {
									window.open(
										"https://join.slack.com/t/kioskprotocol/shared_invite/MjI3NzAwMzMyMTYyLTE1MDI5MjYyNzItM2FiMjA1NWIxZg"
									);
								}}
							/>
						</div>
					</div>
				</div>
				<div
					style={{
						textAlign: "center",
						paddingTop: "50px",
						maxWidth: "800px",
						margin: "auto"
					}}
				>
					<p
						style={{
							color: theme.gray,
							fontSize: "48px",
							fontWeight: "800",
							fontFamily: "Interface, sans-serif",
							letterSpacing: "1px",
							lineHeight: "20%"
						}}
					>
						Build decentralized marketplaces.
					</p>
					<p
						style={{
							color: theme.lightGray,
							fontSize: "30px",
							fontFamily: "Interface, sans-serif",
							fontWeight: "400",
							lineHeight: "44px",
							paddingBottom: "60px"
						}}
					>
						Kiosk is a protocol for buying products using the
						Ethereum blockchain.
					</p>
					<button style={buttonStyle} onClick={onButtonClick}>TRY ALPHA</button>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);