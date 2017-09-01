import { combineReducers } from "redux";
import {
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account
} from "./kiosk";

const rootReducer = combineReducers({
	web3IsLoading,
	web3HasError,
	web3,
	accountHasError,
	account
});

export default rootReducer;