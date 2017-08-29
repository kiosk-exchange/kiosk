import DINRegistryJSON from "../../build/contracts/DINRegistry.json";
import DINMarketJSON from "../../build/contracts/DINMarket.json";
import PublicMarketJSON from "../../build/contracts/PublicMarket.json";
import ENSJSON from "../../build/contracts/ENS.json";
import ENSMarketJSON from "../../build/contracts/ENSMarket.json";
import ENSProductJSON from "../../build/contracts/ENSProduct.json";
import OrderStoreJSON from "../../build/contracts/OrderStore.json";
import KioskMarketTokenJSON from "../../build/contracts/KioskMarketToken.json";
import EtherMarketJSON from "../../build/contracts/EtherMarket.json";
import BuyerJSON from "../../build/contracts/Buyer.json";

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
const getBuyer = web3 => {
	return getContract(web3, BuyerJSON);
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
const getENSProduct = web3 => {
	return getContract(web3, ENSProductJSON);
};
const getOrderStore = web3 => {
	return getContract(web3, OrderStoreJSON);
};
const getEtherMarket = web3 => {
	return getContract(web3, EtherMarketJSON);
};

const getEtherBalance = (web3, account) =>
	new Promise((resolve, reject) => {
		web3.eth.getBalance(account, (err, result) => {
			const balance = web3.fromWei(result, "ether").toNumber()
			resolve(balance)
		});
	});

const getKMTBalance = (web3, account) =>
	new Promise((resolve, reject) => {
		getKioskMarketToken(web3).then(KMT => {
			KMT.balanceOf(account, (err, result) => {
				const balance = web3.fromWei(result, "ether").toNumber()
				resolve(balance)
			});
		});
	});

export {
	getKioskMarketToken,
	getBuyer,
	getDINRegistry,
	getDINMarket,
	getPublicMarket,
	getENS,
	getENSMarket,
	getENSProduct,
	getOrderStore,
	getEtherMarket,
	getEtherBalance,
	getKMTBalance
};