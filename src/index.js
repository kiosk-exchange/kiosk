import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import { configureStore, history } from "./redux/configureStore"

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
		menuItems: ["Marketplace", "Purchases", "Products", "Sales"]
	}
};

const store = configureStore(initialState)

render(
	<Provider store={store}>
		<Router history={history}>
			<div>
				<Route exact path="/" component={App} />
				<Route
					exact
					path="/hello"
					render={() => <h1>Hello, World!</h1>}
				/>
			</div>
		</Router>
	</Provider>,
	document.getElementById("root")
);

// if (module.hot) {
// 	module.hot.accept();
// }