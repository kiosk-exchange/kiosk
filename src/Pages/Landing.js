import React, { Component } from "react";

class Landing extends Component {
	handleDocumentation() {
		location.href = "http://kiosk.readthedocs.io/";
	}

	handleGithub() {
		location.href = "https://github.com/kioskprotocol/kiosk";
	}

	handleSlack() {
		location.href = "https://join.slack.com/t/kioskprotocol/shared_invite/MjI3NzAwMzMyMTYyLTE1MDI5MjYyNzItM2FiMjA1NWIxZg";
	}

	render() {
		return (
			<div>
				<div className="welcome-nav">
					<button onClick={this.handleDocumentation.bind(this)}>
						Documentation
					</button>
					<button onClick={this.handleGithub.bind(this)}>
						Github
					</button>
					<button onClick={this.handleSlack.bind(this)}>Slack</button>
				</div>
				<div className="welcome">
					<h1>kiosk</h1>
					<h3>Build Decentralized Marketplaces</h3>
					<button className="alpha">Try Alpha</button>
				</div>
			</div>
		);
	}
}

export default Landing;