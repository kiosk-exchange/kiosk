import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./redux/reducers";
import { Router, Route } from "react-router";
import createHistory from "history/createBrowserHistory";
import MarketplaceTable from "./components/tables/MarketplaceTable";
import PurchasesTable from "./components/tables/PurchasesTable";
import ProductsTable from "./components/tables/ProductsTable";
import SalesTable from "./components/tables/SalesTable";

import App from "./App";
import "./styles/App.css";

const initialState = {
	config: {
		theme: {
			red: "#FC575E",
			blue: "#32C1FF",
			gray: "#2C363F",
			lightGray: "#6E7E85",
			white: "#F6F8FF"
		},
		menuItems: ["Marketplace", "Purchases", "Products", "Sales"],
		accountDisplayLength: "12ch"
	}
};

const history = createHistory();
const routing = routerMiddleware(history);
const store = createStore(
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(thunk, routing))
);

render(
	<Provider store={store}>
		<Router history={history}>
			<App>
				<Route exact={true} path="/marketplace" component={MarketplaceTable} />
				<Route exact={true} path="/purchases" component={PurchasesTable} />
				<Route exact={true} path="/products" component={ProductsTable} />
				<Route exact={true} path="/sales" component={SalesTable} />
			</App>
		</Router>
	</Provider>,
	document.getElementById("root")
);

// <Route path="/marketplace" component={MarketplaceTable} />
// <Route path="/products" component={ProductsTable} />
// <Route path="/purchases" component={PurchasesTable} />
// <Route path="/sales" component={SalesTable} />
// <Route path="markets" component={MarketTable} />

// TODO: Figure out hot reloading with React Router
// if (module.hot) {
// 	module.hot.accept();
// }