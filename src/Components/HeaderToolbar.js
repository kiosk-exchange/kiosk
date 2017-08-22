import React, { Component } from "react";
import {
	Toolbar,
	ToolbarGroup,
	ToolbarTitle
} from "material-ui/Toolbar";

class HeaderToolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 3
		};
	}

	handleChange = (event, index, value) => this.setState({ value });

	render() {
		return (
			<Toolbar style={{"backgroundColor": "white"}}>
				<ToolbarGroup>
					<ToolbarTitle text="Kovan Test Network" />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarTitle text="0x333333" />
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

export default HeaderToolbar;