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
import { MENU_ITEM } from "../redux/actions/config";
// import marked from "marked";
// import prism from "../utils/prism";

const mapStateToProps = state => ({
	menuItems: state.config.menuItems,
	theme: state.config.theme,
	isLoading: state.results.isLoading,
	allProducts: state.results.allProducts,
	ownerProducts: state.results.ownerProducts,
	marketProducts: state.results.marketProducts,
	purchases: state.results.purchases,
	sales: state.results.sales,
	selectedMenuItemId: state.selectedMenuItemId,
	selectedMarket: state.selectedMarket
});

const TableContainer = ({
	menuItems,
	theme,
	isLoading,
	allProducts,
	ownerProducts,
	marketProducts,
	purchases,
	sales,
	selectedMenuItemId,
	selectedMarket
}) => {
	// Show the market name if a market is selected. Otherwise, show the menu item.
	const title = selectedMarket
		? selectedMarket
		: menuItems[selectedMenuItemId - 1];

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
		switch (selectedMenuItemId) {
			case MENU_ITEM.MARKETPLACE:
				return allProducts;
			case MENU_ITEM.PURCHASES:
				return purchases;
			case MENU_ITEM.PRODUCTS:
				return ownerProducts;
			case MENU_ITEM.SALES:
				return sales;
			default:
				return [];
		}
	};

	let data = dataSource();

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
			case MENU_ITEM.MARKETPLACE:
				return "Marketplace not available";
			case MENU_ITEM.PURCHASES:
				return "You have no purchases";
			case MENU_ITEM.PRODUCTS:
				return "You have no products";
			case MENU_ITEM.SALES:
				return "You have no sales";
			default:
				return "";
		}
	};

	const emptyState = (
		<h1 style={emptyStyle}>
			{emptyStateMessage(selectedMenuItemId)}
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

	const getTable = () => {
		if (selectedMarket && marketProducts.length > 0) {
			return <MarketTable products={marketProducts} />;
		}
		switch (selectedMenuItemId) {
			case MENU_ITEM.MARKETPLACE:
				return <MarketplaceTable products={data} />;
			case MENU_ITEM.PURCHASES:
				return <PurchasesTable orders={data} />;
			case MENU_ITEM.PRODUCTS:
				return <ProductsTable products={data} />;
			case MENU_ITEM.SALES:
				return <SalesTable orders={data} />;
			default:
				return null;
		}
	};

	const actualTable = getTable(selectedMenuItemId);

	return (
		<div>
			{titleSection}
			{actualTable}
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