import React from "react";
import CircularProgress from "material-ui/CircularProgress";
import { connect } from "react-redux";
import {
	MarketplaceTable,
	MarketTable,
	PurchasesTable,
	ProductsTable,
	SalesTable
} from "../components/Table";
import { DATA_TYPE } from "../redux/actions/blockchain";
// import marked from "marked";
// import prism from "../utils/prism";

const mapStateToProps = state => ({
	menuItems: state.config.menuItems,
	theme: state.config.theme,
	isLoading: state.results.isLoading,
	products: state.results.products,
	productFilter: state.results.productFilter, // Array of relevant DINs
	purchases: state.results.purchases,
	sales: state.results.sales,
	dataType: state.dataType,
	selectedMarket: state.selectedMarket
});

const TableContainer = ({
	menuItems,
	theme,
	isLoading,
	products,
	productFilter,
	purchases,
	sales,
	dataType,
	selectedMarket
}) => {
	// Show the market name if a market is selected. Otherwise, show the menu item.
	const title = selectedMarket ? selectedMarket : menuItems[dataType - 1];

	const headerStyle = {
		color: theme.gray,
		fontWeight: "medium",
		display: "block",
		width: "50%",
		textOverflow: "ellipsis",
		overflow: "hidden"
	};

	const titleSection = (
		<h1 style={headerStyle}>
			{title}
		</h1>
	);

	const dataSource = () => {
		switch (dataType) {
			case DATA_TYPE.ALL_PRODUCTS:
			case DATA_TYPE.PRODUCTS:
			case DATA_TYPE.MARKET:
				return products;
			case DATA_TYPE.PURCHASES:
				return purchases;
			case DATA_TYPE.SALES:
				return sales;
			default:
				return [];
		}
	};

	let data = dataSource();

	console.log(data)

	// If owner or specific market, apply filter
	if (productFilter && dataType !== DATA_TYPE.ALL_PRODUCTS) {
		data = data.filter(product => productFilter.includes(product.DIN));
	}	

	const emptyStyle = {
		display: "flex",
		width: "100%",
		paddingTop: "100px",
		justifyContent: "center",
		alignItems: "center",
		color: theme.lightGray
	};

	const emptyStateMessage = menuId => {
		switch (menuId) {
			case DATA_TYPE.ALL_PRODUCTS:
				return "Marketplace not available";
			case DATA_TYPE.PURCHASES:
				return "You have no purchases";
			case DATA_TYPE.PRODUCTS:
				return "You have no products";
			case DATA_TYPE.SALES:
				return "You have no sales";
			default:
				return "";
		}
	};

	const emptyState = (
		<h1 style={emptyStyle}>
			{emptyStateMessage(dataType)}
		</h1>
	);

	const loader = (
		<CircularProgress
			style={emptyStyle}
			size={80}
			thickness={6}
			color={theme.blue}
		/>
	);

	if (data.length === 0) {
		if (isLoading === true) {
			return loader;
		}
		return emptyState;
	}

	const configureTable = () => {
		switch (dataType) {
			case DATA_TYPE.ALL_PRODUCTS:
				return <MarketplaceTable products={data} />;
			case DATA_TYPE.PURCHASES:
				return <PurchasesTable orders={data} />;
			case DATA_TYPE.PRODUCTS:
				return <ProductsTable products={data} />;
			case DATA_TYPE.SALES:
				return <SalesTable orders={data} />;
			case DATA_TYPE.MARKET:
				return <MarketTable products={data} />;
			default:
				return null;
		}
	};

	const table = configureTable();

	return (
		<div>
			{titleSection}
			{table}
		</div>
	);
};

export default connect(mapStateToProps)(TableContainer);

// TODO: Show the actual code with marked
// var markdownString = '```js\n console.log("hello"); \n```';

// const renderer = new marked.Renderer();

// renderer.heading = (text, level) => {
// 	const escapedText = text
// 		.toLowerCase()
// 		.replace(/=&gt;|&lt;| \/&gt;|<code>|<\/code>/g, "")
// 		.replace(/[^\w]+/g, "-");

// 	return (
// 		`
//   <h${level}>
//     <a class="anchor-link" id="${escapedText}"></a>${text}` +
// 		`<a class="anchor-link-style" href="#${escapedText}">${"#"}</a>
//   </h${level}>
// `
// 	);
// };

// marked.setOptions({
// 	gfm: true,
// 	tables: true,
// 	breaks: false,
// 	pedantic: false,
// 	sanitize: false,
// 	smartLists: true,
// 	smartypants: false,
// 	// $FlowFixMe
// 	highlight(code) {
// 		return prism.highlight(code, prism.languages.js);
// 	},
// 	renderer
// });

// 		return (
// 	<span
// 		dangerouslySetInnerHTML={{ __html: marked(markdownString) }}
// 	/>
// );