const Promise = require("bluebird");

export const buyProduct = (Buy, DIN, quantity, value, buyer) => {
	const buyAsync = Promise.promisify(Buy.buy);
	return buyAsync(DIN, quantity, value, { from: buyer, gas: 4700000 });
};

export const buyKMT = (EtherMarket, value, buyer) => {
	return new Promise(function(resolve, reject) {
		EtherMarket.contribute({ from: buyer, value: value }, (error, result) => {
			if (!error) {
				resolve(result);
			} else {
				reject(error)
			}
		});
	})
};
