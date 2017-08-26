import React, { Component } from "react";

class EmptyState extends Component {
	render() {
		const style = {
			textAlign: "center"
		};

		return (
			<div style={style}>
				<h1 style={style}>
					{this.props.title}
				</h1>
				<h1 style={style}>
					{this.props.message}
				</h1>
			</div>
		);
	}
}

export default EmptyState;