export const buyProduct = (KMT, DIN, quantity, value, buyer) => {
	return new Promise((resolve, reject) => {
		KMT.buy(
			DIN,
			quantity,
			value,
			{
				from: buyer,
				gas: 4700000 // TODO: Use estimated gas
			},
			(error, result) => {
				if (!error) {
					resolve(result);
				} else {
					reject(error);
				}
			}
		);
	});
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