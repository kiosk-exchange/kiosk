const Promise = require("bluebird");

export const buyProduct = (KMT, DIN, quantity, value, buyer) => {
	const buyAsync = Promise.promisify(KMT.buy);
	return buyAsync(DIN, quantity, value, { from: buyer, gas: 4700000 });
};

export const buyKMT = (EtherMarket, value, buyer) => {
	EtherMarket.contribute({ from: buyer, value: value }, (error, result) => {
		if (!error) {
			console.log(result);
		} else {
			console.log(error);
		}
	});
};
