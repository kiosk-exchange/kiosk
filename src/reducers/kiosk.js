import {
	WEB_3_LOADING,
	WEB_3_ERROR,
	WEB_3_SUCCESS,
	ACCOUNT_ERROR,
	ACCOUNT_SUCCESS
} from "../actions/kiosk";

export const web3IsLoading = (state = false, action) => {
	switch (action.type) {
		case WEB_3_LOADING:
			return action.bool;
		default:
			return state;
	}
};

export const web3HasError = (state = false, action) => {
	switch (action.type) {
		case WEB_3_ERROR:
			return action.bool;
		default:
			return state;
	}
};

export const web3 = (state = null, action) => {
	switch (action.type) {
		case WEB_3_SUCCESS:
			return action.web3;
		default:
			return state;
	}
};

export const accountHasError = (state = false, action) => {
	switch (action.type) {
		case ACCOUNT_ERROR:
			return action.bool;
		default:
			return state;
	}
};

export const account = (state = null, action) => {
	switch (action.type) {
		case ACCOUNT_SUCCESS:
			return {
				...state,
				address: action.account
			};
		default:
			return state;
	}
};