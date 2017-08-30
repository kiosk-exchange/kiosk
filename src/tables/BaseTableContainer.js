import React, { Component } from "react";
import PropTypes from "prop-types";
import BaseTable from "./BaseTable";
import CircularProgress from "material-ui/CircularProgress";

class BaseTableContainer extends Component {
	render() {
		const headerStyle = {
			color: this.context.theme.gray,
			fontWeight: "medium"
		};

		let loader = null;

		if (this.props.loading === true) {
			loader = (
				<CircularProgress
					style={{ marginLeft: "auto", paddingRight: "20px" }}
					size={40}
					thickness={6}
					color={this.context.theme.blue}
				/>
			);
		}

		return (
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						width: "100%",
						alignItems: "center"
					}}
				>
					<h1 style={headerStyle}>
						{this.props.title}
					</h1>
					{loader}
				</div>
				<BaseTable {...this.props} />
			</div>
		);
	}
}

BaseTableContainer.contextTypes = {
	theme: PropTypes.object
};

export default BaseTableContainer;