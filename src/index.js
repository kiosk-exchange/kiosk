import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/configureStore";
import { BrowserRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
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

const store = configureStore(initialState);

render(
	<Provider store={store}>
		<BrowserRouter>
			<MuiThemeProvider>
				<App />
			</MuiThemeProvider>
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);

// if (module.hot) {
// 	module.hot.accept();
// }