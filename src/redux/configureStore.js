import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./reducers";
import { routerMiddleware } from 'react-router-redux'
import createHistory from "history/createBrowserHistory";

export const history = createHistory();
const routing = routerMiddleware(history);

export const configureStore = initialState => {
	return createStore(
		rootReducer,
		initialState,
		composeWithDevTools(applyMiddleware(thunk, routing))
	);
};