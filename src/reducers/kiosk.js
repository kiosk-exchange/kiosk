import {
	WEB_3_LOADING,
	WEB_3_ERROR,
	WEB_3_SUCCESS,
	ACCOUNT_ERROR,
	ACCOUNT_SUCCESS,
	NETWORK_ERROR,
	NETWORK_SUCCESS
} from "../actions/kiosk";

/*
*  @param state - From Redux
*  @param action - From Redux
*  @param { string } type - The relevant action type (e.g., WEB_3_LOADING)
*  @param { string } prop - The relevant action prop (e.g., "bool")
*/
const createReducer = (state, action, type, prop) => {
	switch (action.type) {
		case type:
			return action[prop];
		default:
			return state;
	}
};

/*
*  NOTE: Name reducers according to how you would like to access 
*  them in a component (e.g. web3 instead of web3Success)
*/
export const web3IsLoading = (state = false, action) =>
	createReducer(state, action, WEB_3_LOADING, "bool");

export const web3HasError = (state = false, action) =>
	createReducer(state, action, WEB_3_ERROR, "bool");

export const web3 = (state = null, action) =>
	createReducer(state, action, WEB_3_SUCCESS, "web3");

export const accountHasError = (state = false, action) =>
	createReducer(state, action, ACCOUNT_ERROR, "bool");

export const account = (state = null, action) =>
	createReducer(state, action, ACCOUNT_SUCCESS, "account");

export const networkHasError = (state = false, action) =>
	createReducer(state, action, NETWORK_ERROR, "bool");

export const network = (state = null, action) => 
	createReducer(state, action, NETWORK_SUCCESS, "network");