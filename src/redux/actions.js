export const GET_WEB_3 = "GET_WEB_3";
export const SHOW_BUY_MODAL = "SHOW_BUY_MODAL";

export const showBuyModal = product => ({
	type: SHOW_BUY_MODAL,
	product
});

export const getWeb3 = web3 => ({
	type: GET_WEB_3,
	web3
})