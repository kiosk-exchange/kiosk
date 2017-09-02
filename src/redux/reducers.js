import { combineReducers } from "redux";

import {
	WEB_3_LOADING,
	WEB_3_ERROR,
	WEB_3_SUCCESS,
	ACCOUNT_ERROR,
	ACCOUNT_SUCCESS,
	NETWORK_ERROR,
	NETWORK_SUCCESS,
	KMT_CONTRACT,
	DIN_REGISTRY_CONTRACT,
	ORDER_STORE_CONTRACT,
	KMT_BALANCE,
	ETH_BALANCE,
	SELECTED_MENU_ITEM_ID,
	RECEIVED_ALL_PRODUCTS,
	RECEIVED_OWNER_PRODUCTS,
	RECEIVED_PURCHASES,
	RECEIVED_SALES
} from "./actions";

/*
*  @param state - From Redux
*  @param action - From Redux
*  @param { string } type - The relevant action type (e.g., WEB_3_LOADING)
*  @param { string } prop - The relevant action prop (e.g., "bool")
*/
const reducer = (state, action, type) => {
	switch (action.type) {
		case type:
			return action.data;
		default:
			return state;
	}
};

// Initial state
const theme = (state = null, action) => { return state };
const menuItems = (state = null, action) => { return state };

/*
*  Name reducers according to how you would like to access  them in a component (e.g. web3 instead of web3Success)
*  Use a separate reducer for each top-level object in the state tree.
*/
const web3IsLoading = (state = false, action) => reducer(state, action, WEB_3_LOADING);
const web3HasError = (state = false, action) => reducer(state, action, WEB_3_ERROR);
const web3 = (state = null, action) => reducer(state, action, WEB_3_SUCCESS);
const accountHasError = (state = false, action) => reducer(state, action, ACCOUNT_ERROR);
const account = (state = null, action) => reducer(state, action, ACCOUNT_SUCCESS);
const networkHasError = (state = false, action) => reducer(state, action, NETWORK_ERROR);
const network = (state = null, action) => reducer(state, action, NETWORK_SUCCESS);
const KMTContract = (state = null, action) => reducer(state, action, KMT_CONTRACT);
const DINRegistry = (state = null, action) => reducer(state, action, DIN_REGISTRY_CONTRACT);
const OrderStore = (state = null, action) => reducer(state, action, ORDER_STORE_CONTRACT);
const KMTBalance = (state = null, action) => reducer(state, action, KMT_BALANCE);
const ETHBalance = (state = null, action) => reducer(state, action, ETH_BALANCE);
const selectedMenuItemId = (state = 0, action) => reducer(state, action, SELECTED_MENU_ITEM_ID);
const allProducts = (state = null, action) => reducer(state, action, RECEIVED_ALL_PRODUCTS);
const ownerProducts = (state = null, action) => reducer(state, action, RECEIVED_OWNER_PRODUCTS);
const purchases = (state = null, action) => reducer(state, action, RECEIVED_PURCHASES);
const sales = (state = null, action) => reducer(state, action, RECEIVED_SALES);

export const rootReducer = combineReducers({
	theme,
	menuItems,
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account,
	networkHasError,
	network,
	KMTContract,
	DINRegistry,
	OrderStore,
	KMTBalance,
	ETHBalance,
	selectedMenuItemId,
	allProducts,
	ownerProducts,
	purchases,
	sales
});