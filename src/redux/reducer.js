import { SHOW_BUY_MODAL } from "./actions";

let theme = {
	theme: {
		red: "#FC575E",
		blue: "#32C1FF",
		gray: "#2C363F",
		lightGray: "#6E7E85",
		white: "#F6F8FF"
	}
};

export const reducer = (state = theme, action) => {
	switch (action.type) {
		case SHOW_BUY_MODAL:
			console.log("SHOW BUY MODAL");
			return {
				...state,
				showBuyModal: true
			};
		default:
			return state;
	}
};