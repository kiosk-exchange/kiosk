import React from "react";
import { v4 } from "node-uuid";
import { TableRowColumn } from "material-ui/Table";
import { Link } from "react-router-dom";
import { selectMarket } from "../../redux/actions/actions";
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => ({
	onLinkClick: market => {
		dispatch(selectMarket(market));
	}
});

const MarketColumn = ({ market, onLinkClick }) => {
	const linkStyle = {
		color: "#32C1FF",
		textDecoration: "none"
	};

	return (
		<TableRowColumn key={v4()} style={{ maxWidth: "60px" }}>
			<Link
				style={linkStyle}
				to={`/market/${market.address}`}
				onClick={() => onLinkClick(market)}
			>
				{market.name}
			</Link>
		</TableRowColumn>
	);
};

export default connect(null, mapDispatchToProps)(MarketColumn);