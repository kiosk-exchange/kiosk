import React, { Component } from "react";

class EmptyState extends Component {
	render() {
		const style = {
			backgroundColor: "orange",
			textAlign: "center",
		};

		return (
			<div style={style}>
				<h1 style={style}>
					{this.props.title}
				</h1>
			</div>
		);
	}
}

export default EmptyState;