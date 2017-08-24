import React, { Component } from "react";
import PropTypes from "prop-types";
import BaseTable from "./BaseTable";

class BaseTableContainer extends Component {
	render() {
		const headerStyle = {
			color: this.context.kioskGray,
			fontWeight: "medium",
			padding: "20px 0px"
		}

		return (
			<div>
				<h1 style={headerStyle}>{this.props.title}</h1>
				<BaseTable {...this.props}/>
			</div>
		);
	}
}

BaseTableContainer.contextTypes = {
	kioskGray: PropTypes.string
}

export default BaseTableContainer;