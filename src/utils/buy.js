export const buyProduct = (DIN, quantity, price, buyer, market) => {
	market.buy(
		DIN,
		quantity,
		{
			from: buyer,
			value: price,
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