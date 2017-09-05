import React from "react";
import { render } from "react-dom";

// State
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import {
	config,
	results,
	selectedMenuItemId,
	purchaseIsPending,
	buyModal
} from "./redux/reducers";
import { routerReducer, routerMiddleware } from "react-router-redux";

// Middleware
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// UI
import App from "./App";
import "./styles/App.css";

// Routing
import createHistory from "history/createBrowserHistory";
import { Router, Route, browserHistory } from 'react-router'
import { ConnectedRouter } from "react-router-redux";

const history = createHistory();
const middleware = routerMiddleware(history);

const initialState = {
	config: {
		theme: {
			red: "#FC575E",
			blue: "#32C1FF",
			gray: "#2C363F",
			lightGray: "#6E7E85",
			white: "#F6F8FF"
		},
		menuItems: ["Marketplace", "Purchases", "Products", "Sales"]
	}
};

const store = createStore(
	combineReducers({
		config,
		results,
		selectedMenuItemId,
		purchaseIsPending,
		buyModal,
		router: routerReducer
	}),
	initialState,
	composeWithDevTools(applyMiddleware(thunk, middleware))
);

render(
	<Provider store={store}>
		<Router history={history}>
			<div>
				<Route exact path="/" component={App} />
				<Route exact path="/hello" render={() => <h1>Hello, World!</h1>} />
			</div>
		</Router>
	</Provider>,
	document.getElementById("root")
);

// if (module.hot) {
// 	module.hot.accept();
// }

// </Provider>,