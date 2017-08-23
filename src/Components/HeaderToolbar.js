import React, { Component } from "react";
import {
	Toolbar,
	ToolbarGroup,
	ToolbarTitle
} from "material-ui/Toolbar";

class HeaderToolbar extends Component {
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