import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware, compose } from "redux";
import DevTools from "./containers/DevTools";
import thunk from "redux-thunk";
import { rootReducer } from "./redux/reducers";
import { Router, Route, Switch } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Landing from "./containers/Landing";
import {
	Marketplace,
	Purchases,
	Products,
	Sales,
	Market
} from "./containers/Container";

import "./styles/App.css";

const initialState = {
	config: {
		theme: {
			red: "#FC575E",
			blue: "#32C1FF",
			green: "#4ED4B3",
			gray: "#2C363F",
			lightGray: "#6E7E85",
			white: "#F6F8FF"
		},
		menuItems: ["Marketplace", "Purchases", "Products", "Sales"]
	}
};

const history = createBrowserHistory();
const routing = routerMiddleware(history);

const enhancer = compose(
	applyMiddleware(thunk, routing),
	DevTools.instrument()
);
const store = createStore(rootReducer, initialState, enhancer);

render(
	<Provider store={store}>
		<MuiThemeProvider>
			<Router history={history}>
				<Switch>
					<Route exact={true} path="/" component={Landing} />
					<Route
						exact={true}
						path="/marketplace"
						component={Marketplace}
					/>
					<Route
						exact={true}
						path="/purchases"
						component={Purchases}
					/>
					<Route exact={true} path="/products" component={Products} />
					<Route exact={true} path="/sales" component={Sales} />
					<Route path="/market/:market" component={Market} />
				</Switch>
			</Router>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById("root")
);