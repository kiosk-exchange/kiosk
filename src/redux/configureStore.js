import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./reducers";
import { routerReducer, routerMiddleware, push } from 'react-router-redux'

export const configureStore = initialState => {
	return createStore(
		rootReducer,
		initialState,
		composeWithDevTools(applyMiddleware(thunk))
	);
};