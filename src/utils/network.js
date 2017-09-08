const getNetwork = networkId => {
	switch (networkId) {
		// MetaMask names and colors
		case "1":
			return {
				id: networkId,
				name: "Main Ethereum Network",
				color: "#05868A",
				valid: false
			};
		case "2":
			return {
				id: networkId,
				name: "Morden Test Network",
				color: "#FFFFFF",
				valid: false
			};
		case "3":
			return {
				id: networkId,
				name: "Ropsten Test Network",
				color: "#E71650",
				valid: false
			};
		case "4":
			return {
				id: networkId,
				name: "Rinkeby Test Network",
				color: "#EBB240",
				valide: false
			};
		case "42":
			return {
				id: networkId,
				name: "Kovan Test Network",
				color: "#6A0397",
				valid: true
			};
		default:
			return {
				id: networkId,
				name: "Private Network",
				color: "#000000",
				valid: true
			};
	}
};

export { getNetwork };