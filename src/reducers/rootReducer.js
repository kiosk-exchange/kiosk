import { combineReducers } from "redux";
import {
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account,
	networkHasError,
	network,
	KMTContract
} from "./kiosk";

const rootReducer = combineReducers({
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account,
	networkHasError,
	network,
	KMTContract
});

export default rootReducer;