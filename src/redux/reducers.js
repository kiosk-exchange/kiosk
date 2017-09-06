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
	BUYER_CONTRACT,
	DIN_REGISTRY_CONTRACT,
	ORDER_STORE_CONTRACT,
	ETHER_MARKET_CONTRACT,
	KMT_BALANCE,
	ETH_BALANCE,
	SELECTED_MENU_ITEM_ID,
	REQUEST_LOADING,
	REQUEST_ERROR,
	RECEIVED_ALL_PRODUCTS,
	RECEIVED_OWNER_PRODUCTS,
	RECEIVED_PURCHASES,
	RECEIVED_SALES,
	SELECTED_PRODUCT,
	SELECTED_QUANTITY,
	SHOW_BUY_MODAL,
	PURCHASE_IS_PENDING,
	TX_PENDING_ADDED,
	TX_PENDING_REMOVED,
	TOTAL_PRICE_CALCULATING,
	TOTAL_PRICE,
	PRODUCT_AVAILABILITY
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
const web3 = (state = null, action) => reducer(state, action, WEB_3_SUCCESS);
const web3IsLoading = (state = false, action) => reducer(state, action, WEB_3_LOADING);
const web3Error = (state = false, action) => reducer(state, action, WEB_3_ERROR);
const accountHasError = (state = false, action) => reducer(state, action, ACCOUNT_ERROR);
const account = (state = null, action) => reducer(state, action, ACCOUNT_SUCCESS);
const networkHasError = (state = false, action) => reducer(state, action, NETWORK_ERROR);
const network = (state = null, action) => reducer(state, action, NETWORK_SUCCESS);
const KMTContract = (state = null, action) => reducer(state, action, KMT_CONTRACT);
const BuyerContract = (state = null, action) => reducer(state, action, BUYER_CONTRACT);
const DINRegistry = (state = null, action) => reducer(state, action, DIN_REGISTRY_CONTRACT);
const OrderStore = (state = null, action) => reducer(state, action, ORDER_STORE_CONTRACT);
const EtherMarket = (state = null, action) => reducer(state, action, ETHER_MARKET_CONTRACT);
const KMTBalance = (state = null, action) => reducer(state, action, KMT_BALANCE);
const ETHBalance = (state = null, action) => reducer(state, action, ETH_BALANCE);
const selectedMenuItemId = (state = 1, action) => reducer(state, action, SELECTED_MENU_ITEM_ID);
const purchaseIsPending = (state = false, action) => reducer(state, action, PURCHASE_IS_PENDING);
const txsPending = (state = [], action) => {
	if (action.type === TX_PENDING_ADDED) {
		return state.concat(action.data)
	} else if (action.type === TX_PENDING_REMOVED) {
		var indx = state.indexOf(action.data);
		return [
			...state.slice(0, indx),
			...state.slice(indx + 1)
		]
	}
	return state;
}

const buyModalDefaultState = {
	product: null,
	quantity: null,
	totalPrice: null,
	available: null,
	isOpen: false,
	isLoading: false,
	error: false,
}

const buyModal = (state = buyModalDefaultState, action) => {
	switch (action.type) {
		case SHOW_BUY_MODAL:
			if (action.data === false) {
				// Reset
				return buyModalDefaultState
			}
			return {
				...state,
				quantity: 1,
				isOpen: action.data,
			};
		case SELECTED_PRODUCT:
			return {
				...state,
				product: action.data
			}
		case SELECTED_QUANTITY:
			return {
				...state,
				quantity: action.data
			}
		case TOTAL_PRICE_CALCULATING:
			return {
				...state,
				isLoading: true
			}
		case TOTAL_PRICE:
			return {
				...state,
				isLoading: false,
				error: false,
				totalPrice: action.data
			}
		case PRODUCT_AVAILABILITY:
			return {
				...state,
				available: action.data
			}
		default:
			return state;
	}
};

const resultsDefaultState = {
	isLoading: true,
	allProducts: [],
	ownerProducts: [],
	purchases: [],
	sales: [],
	marketProducts: []
}

const results = (state = resultsDefaultState, action) => {
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
		case RECEIVED_ALL_PRODUCTS:
			return {
				...state,
				allProducts: action.data
			};
		case RECEIVED_OWNER_PRODUCTS:
			return {
				...state,
				ownerProducts: action.data
			};
		case RECEIVED_PURCHASES:
			return {
				...state,
				purchases: action.data
			};
		case RECEIVED_SALES:
			return {
				...state,
				sales: action.data
			};
		default:
			return state;
	}
};

const config = combineReducers({
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
	BuyerContract,
	DINRegistry,
	OrderStore,
	EtherMarket
});

export const rootReducer = combineReducers({
	config,
	results,
	selectedMenuItemId,
	buyModal,
	purchaseIsPending,
	txsPending
});
