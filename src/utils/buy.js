export const buyProduct = (Buyer, DIN, quantity, value, buyer) => {
	Buyer.buy(
		DIN,
		quantity,
		value,
		{
			from: buyer,
			gas: 4700000 // TODO: Use estimated gas
		},
		(error, result) => {
			if (!error) {
				console.log(result);
			} else {
				console.log(error);
			}
		}
	);
};

export const buyKMT = (etherMarket, value, buyer) => {
	etherMarket.contribute({ from: buyer, value: value }, (error, result) => {
		if (!error) {
			console.log(result);
		} else {
			console.log(error);
		}
	});
};