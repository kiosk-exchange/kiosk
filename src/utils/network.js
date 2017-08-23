const getNetwork = async web3 => {
	await web3.version.getNetwork((err, networkId) => {
		switch (networkId) {
			case "1":
				return "Main Ethereum Network";
			case "2":
				return "Morden Test Network";
			case "3":
				return "Ropsten Test Network";
			case "42":
				return "Kovan Test Network";
			default:
				return "Private Network";
		}
	});
};

export default getNetwork;