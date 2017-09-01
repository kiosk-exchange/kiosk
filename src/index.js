import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/configureStore";
import { BrowserRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import App from "./App";

import "./styles/App.css";

const store = configureStore();

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