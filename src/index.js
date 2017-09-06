import React from "react";
import { render } from "react-dom";

// State
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./redux/reducers";
import { routerMiddleware } from "react-router-redux";

// Middleware
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// UI
import App from "./App";
import "./styles/App.css";

// Routing
import createHistory from "history/createBrowserHistory";
import { Router, Route } from 'react-router'

const history = createHistory();
const routing = routerMiddleware(history);

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
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(thunk, routing))
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