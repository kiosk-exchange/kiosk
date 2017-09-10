import React, { Component } from "react";

class ErrorMessage extends Component {
	render() {
		const style = {
			display: "flex",
			width: "100%",
			textAlign: "center",
			padding: "20px 0px"
		};

		const message = (
			<div>
				<div style={style}>
					<div style={{ width: "100%" }}>
						<h1 style={{ color: "#6E7E85" }}>
							{this.props.title}
						</h1>
					</div>
				</div>
			</div>
		);

		let icon = null;

		if (this.props.showIcon === true) {
			icon = (
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
			);
		}

		return (
			<div>
				{message}
				{icon}
			</div>
		);
	}
}

export default ErrorMessage;