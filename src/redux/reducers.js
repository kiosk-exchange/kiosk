import {
	WEB_3_LOADING,
	WEB_3_ERROR,
	WEB_3_SUCCESS,
	ACCOUNT_ERROR,
	ACCOUNT_SUCCESS,
	NETWORK_ERROR,
	NETWORK_SUCCESS,
	KMT_CONTRACT,
	KMT_BALANCE,
	ETH_BALANCE
} from "../actions/kiosk";

export const rootReducer = combineReducers({
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account,
	networkHasError,
	network,
	KMTContract,
	KMTBalance,
	ETHBalance
});

/*
*  @param state - From Redux
*  @param action - From Redux
*  @param { string } type - The relevant action type (e.g., WEB_3_LOADING)
*  @param { string } prop - The relevant action prop (e.g., "bool")
*/
const reducer = (state, action, type) => (state, action, type) => {
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
export const web3IsLoading = reducer(state = false, action, WEB_3_LOADING);
export const web3HasError = reducer(state = false, action, WEB_3_ERROR);
export const web3 = reducer(state = null, action, WEB_3_SUCCESS);
export const accountHasError = reducer(state = false, action, ACCOUNT_ERROR);
export const account = reducer(state = null, action, ACCOUNT_SUCCESS);
export const networkHasError = reducer(state = false, action, NETWORK_ERROR);
export const network = reducer(state = null, action, NETWORK_SUCCESS);
export const KMTContract = reducer(state = null, action, KMT_CONTRACT);
export const KMTBalance = reducer(state = null, action, KMT_BALANCE);
export const ETHBalance = reducer(state = null action, ETH_BALANCE);

