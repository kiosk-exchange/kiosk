import { combineReducers } from "redux";
import {
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account,
	networkHasError,
	network
} from "./kiosk";

const rootReducer = combineReducers({
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account,
	networkHasError,
	network
});

export default rootReducer;