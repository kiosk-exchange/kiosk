import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import {
	SHOW_BUY_MODAL,
	SHOW_BUY_KMT_MODAL,
	SELECTED_PRODUCT,
	SELECTED_QUANTITY,
	SELECTED_MARKET,
	CHANGED_ETHER_CONTRIBUTION_AMOUNT
} from "./actions/actions";

import {
	WEB_3_LOADING,
	WEB_3_ERROR,
	WEB_3_SUCCESS,
	ACCOUNT_ERROR,
	ACCOUNT_SUCCESS,
	NETWORK_ERROR,
	NETWORK_SUCCESS,
	KMT_CONTRACT,
	BUY_CONTRACT,
	DIN_REGISTRY_CONTRACT,
	ORDER_STORE_CONTRACT,
	ETHER_MARKET_CONTRACT,
	KMT_BALANCE,
	ETH_BALANCE
} from "./actions/config";

import {
	REQUEST_LOADING,
	REQUEST_ERROR,
	RECEIVED_PRODUCT,
	RECEIVED_OWNER_DINS,
	RECEIVED_MARKET_DINS,
	RECEIVED_PURCHASES,
	RECEIVED_SALES,
	TX_PENDING_ADDED,
	TX_PENDING_REMOVED,
	TX_SUCCEEDED,
	SHOW_TX_SUCCEEDED,
	TOTAL_PRICE_CALCULATING,
	TOTAL_PRICE,
	PRODUCT_AVAILABILITY
} from "./actions/blockchain";

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

/*
*  Name reducers according to how you would like to access  them in a component (e.g. web3 instead of web3Success)
*  Use a separate reducer for each top-level object in the state tree.
*/
const web3 = (state = null, action) => reducer(state, action, WEB_3_SUCCESS);
const web3IsLoading = (state = false, action) =>
	reducer(state, action, WEB_3_LOADING);
const web3Error = (state = false, action) =>
	reducer(state, action, WEB_3_ERROR);
const accountHasError = (state = false, action) =>
	reducer(state, action, ACCOUNT_ERROR);
const account = (state = null, action) =>
	reducer(state, action, ACCOUNT_SUCCESS);
const networkHasError = (state = false, action) =>
	reducer(state, action, NETWORK_ERROR);
const network = (state = null, action) =>
	reducer(state, action, NETWORK_SUCCESS);
const KMTContract = (state = null, action) =>
	reducer(state, action, KMT_CONTRACT);
const BuyContract = (state = null, action) =>
	reducer(state, action, BUY_CONTRACT);
const DINRegistry = (state = null, action) =>
	reducer(state, action, DIN_REGISTRY_CONTRACT);
const OrderStore = (state = null, action) =>
	reducer(state, action, ORDER_STORE_CONTRACT);
const EtherMarket = (state = null, action) =>
	reducer(state, action, ETHER_MARKET_CONTRACT);
const KMTBalance = (state = null, action) =>
	reducer(state, action, KMT_BALANCE);
const ETHBalance = (state = null, action) =>
	reducer(state, action, ETH_BALANCE);
const selectedMarket = (state = null, action) =>
	reducer(state, action, SELECTED_MARKET);
const etherContribution = (state = 0, action) =>
	reducer(state, action, CHANGED_ETHER_CONTRIBUTION_AMOUNT)

const txDefaultState = {
	pending: [],
	success: false,
	showSuccess: false
};

const transactions = (state = txDefaultState, action) => {
	switch (action.type) {
		case TX_PENDING_ADDED:
			return {
				...state,
				pending: state.pending.concat(action.data)
			};
		case TX_PENDING_REMOVED:
			const index = state.pending.indexOf(action.data);
			return {
				...state,
				pending: [
					...state.pending.slice(0, index),
					...state.pending.slice(index + 1)
				]
			};
		case TX_SUCCEEDED:
			return {
				...state,
				success: true
			};
		case SHOW_TX_SUCCEEDED:
			return {
				...state,
				success: false // Reset
			};
		default:
			return state;
	}
};

const buyModalDefaultState = {
	product: null,
	quantity: null,
	totalPrice: null,
	available: null,
	isOpen: false,
	isLoading: false,
	error: false
};

export const showBuyKMTModal = (state = false, action) =>
	reducer(state, action, SHOW_BUY_KMT_MODAL);

export const buyModal = (state = buyModalDefaultState, action) => {
	switch (action.type) {
		case SHOW_BUY_MODAL:
			if (action.data === false) {
				// Reset
				return buyModalDefaultState;
			}
			return {
				...state,
				quantity: 1,
				isOpen: action.data
			};
		case SELECTED_PRODUCT:
			return {
				...state,
				product: action.data
			};
		case SELECTED_QUANTITY:
			return {
				...state,
				quantity: action.data
			};
		case TOTAL_PRICE_CALCULATING:
			return {
				...state,
				isLoading: true
			};
		case TOTAL_PRICE:
			return {
				...state,
				isLoading: false,
				error: false,
				totalPrice: action.data
			};
		case PRODUCT_AVAILABILITY:
			return {
				...state,
				available: action.data
			};
		default:
			return state;
	}
};

const resultsDefaultState = {
	isLoading: true,
	products: [],
	purchases: [],
	sales: [],
	ownedDINs: [],
	marketDINs: []
};

export const results = (state = resultsDefaultState, action) => {
	switch (action.type) {
		case REQUEST_LOADING:
			return {
				...state,
				isLoading: action.data
			};
		case REQUEST_ERROR:
			return {
				...state,
				error: action.data
			};
		case RECEIVED_OWNER_DINS:
			return {
				...state,
				ownedDINs: action.data
			};
		case RECEIVED_MARKET_DINS:
			return {
				...state,
				marketDINs: action.data
			};
		case RECEIVED_PRODUCT:
			// Get the index of the existing product (if any) from the state by its DIN
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
			const index = state.products.findIndex(product => {
				return product.DIN === action.data.DIN;
			});

			let products;

			// If the product exists in state, replace the existing product
			if (index >= 0) {
				products = [
					...state.products.slice(0, index),
					action.data,
					...state.products.slice(index + 1)
				];
				// If the product has a name and market, add it to the array
			} else if (
				action.data.name &&
				action.data.market !==
					"0x0000000000000000000000000000000000000000"
			) {
				// Sort by DIN
				products = state.products.concat(action.data).sort((a, b) => {
					return a.DIN - b.DIN;
				});
			} else {
				products = state.products;
			}
			return {
				...state,
				products: products
			};
		case RECEIVED_PURCHASES:
			return {
				...state,
				isLoading: false,
				purchases: action.data
			};
		case RECEIVED_SALES:
			return {
				...state,
				isLoading: false,
				sales: action.data
			};
		default:
			return state;
	}
};

// Initial state
const theme = (state = null, action) => {
	return state;
};
const menuItems = (state = null, action) => {
	return state;
};

export const config = combineReducers({
	theme,
	menuItems,
	web3IsLoading,
	web3Error,
	web3,
	accountHasError,
	account,
	networkHasError,
	network,
	KMTBalance,
	ETHBalance,
	KMTContract,
	BuyContract,
	DINRegistry,
	OrderStore,
	EtherMarket
});

export const rootReducer = combineReducers({
	config,
	results,
	transactions,
	selectedMarket,
	buyModal,
	showBuyKMTModal,
	etherContribution,
	routing: routerReducer
});
