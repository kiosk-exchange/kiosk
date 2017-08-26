import React, { Component } from "react";

class ErrorMessage extends Component {
	render() {
		const style = {
			position: "relative",
			top: "50%",
			transform: "translateY(-50%)"
		};

		return (
			<div style={style}>
				<div>
					<h1>You're not connected to an Ethereum node</h1>
					<a href="https://metamask.io/" target="_blank">
						<img src="metamask.png" alt="metamask" width="300px" />
					</a>
				</div>
			</div>
		);
	}
}

export default ErrorMessage;