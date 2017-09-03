import KioskMarketTokenJSON from "../../build/contracts/KioskMarketToken.json";
import BuyerJSON from "../../build/contracts/Buyer.json";
import DINRegistryJSON from "../../build/contracts/DINRegistry.json";
import OrderStoreJSON from "../../build/contracts/OrderStore.json";
import EtherMarketJSON from "../../build/contracts/EtherMarket.json";

const contract = require("truffle-contract");

const getContract = (web3, json) =>
	new Promise((resolve, reject) => {
		const aContract = contract(json);
		aContract.setProvider(web3.currentProvider);
		aContract
			.deployed()
			.then(instance => {
				resolve(instance.contract);
			})
			.catch(err => {
				reject(err);
			});
	});

export const getKioskMarketToken = web3 => {
	return getContract(web3, KioskMarketTokenJSON);
};
export const getBuyer = web3 => {
	return getContract(web3, BuyerJSON);
};
export const getDINRegistry = web3 => {
	return getContract(web3, DINRegistryJSON);
};
export const getOrderStore = web3 => {
	return getContract(web3, OrderStoreJSON);
};
export const getEtherMarket = web3 => {
	return getContract(web3, EtherMarketJSON);
};