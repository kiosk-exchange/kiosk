import React, { Component } from "react";

class ErrorMessage extends Component {
	render() {
		const style = {
			display: "flex",
			width: "100%",
			textAlign: "center",
			padding: "20px 0px"
		};

		return (
			<div>
				<div style={style}>
					<div style={{ width: "100%" }}>
						<h1 style={{ color: "#6E7E85" }}>
							You are not connected to an Ethereum node
						</h1>
					</div>
				</div>
				<div style={style}>
					<a
						style={{
							width: "100%"
						}}
						href="https://metamask.io/"
						target="_blank"
					>
						<img src="metamask.png" alt="metamask" width="300px" />
					</a>
				</div>
			</div>
		);
	}
}

export default ErrorMessage;