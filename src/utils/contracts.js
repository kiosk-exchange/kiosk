import DINRegistryJSON from "../../build/contracts/DINRegistry.json";
import DINMarketJSON from "../../build/contracts/DINMarket.json";
import PublicMarketJSON from "../../build/contracts/PublicMarket.json";
import ENSJSON from "../../build/contracts/ENS.json";
import ENSMarketJSON from "../../build/contracts/ENSMarket.json";
import ENSPublicProductJSON from "../../build/contracts/ENSPublicProduct.json";
import OrderTrackerJSON from "../../build/contracts/OrderTracker.json";
import KioskMarketTokenJSON from "../../build/contracts/KioskMarketToken.json";
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

const getKioskMarketToken = web3 => {
	return getContract(web3, KioskMarketTokenJSON);
};
const getDINRegistry = web3 => {
	return getContract(web3, DINRegistryJSON);
};
const getDINMarket = web3 => {
	return getContract(web3, DINMarketJSON);
};
const getPublicMarket = web3 => {
	return getContract(web3, PublicMarketJSON);
};
const getENS = web3 => {
	return getContract(web3, ENSJSON);
};
const getENSMarket = web3 => {
	return getContract(web3, ENSMarketJSON);
};
const getENSPublicProduct = web3 => {
	return getContract(web3, ENSPublicProductJSON);
};
const getOrderTracker = web3 => {
	return getContract(web3, OrderTrackerJSON);
};
const getEtherMarket = web3 => {
	return getContract(web3, EtherMarketJSON);
};

const getEtherBalance = (web3, account) =>
	new Promise((resolve, reject) => {
		web3.eth.getBalance(account, (err, result) => {
			resolve(result);
		});
	});

const getKMTBalance = (web3, account) =>
	new Promise((resolve, reject) => {
		getKioskMarketToken(web3).then(KMT => {
			KMT.balanceOf(account, (err, result) => {
				resolve(result);
			});
		});
	});

export {
	getKioskMarketToken,
	getDINRegistry,
	getDINMarket,
	getPublicMarket,
	getENS,
	getENSMarket,
	getENSPublicProduct,
	getOrderTracker,
	getEtherMarket,
	getEtherBalance,
	getKMTBalance
};