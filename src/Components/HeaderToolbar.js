import React, { Component } from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import FontIcon from "material-ui/FontIcon";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";
import RaisedButton from "material-ui/RaisedButton";
import {
	Toolbar,
	ToolbarGroup,
	ToolbarSeparator,
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
				<ToolbarGroup float="right">
					<ToolbarTitle text="0x333333" />
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

export default HeaderToolbar;