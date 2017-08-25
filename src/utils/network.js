const getNetwork = networkId => {
	switch (networkId) {
		// MetaMask names and colors
		case "1":
			return {
				name: "Main Ethereum Network",
				color: "#05868A"
			};
		case "2":
			return {
				name: "Morden Test Network",
				color: "#FFFFFF"
			};
		case "3":
			return {
				name: "Ropsten Test Network",
				color: "#E71650"
			};
		case "4":
			return {
				name: "Rinkeby Test Network",
				color: "#EBB240"
			};
		case "42":
			return {
				name: "Kovan Test Network",
				color: "#6A0397"
			};
		default:
			return {
				name: "Private Network",
				color: "#000000"
			};
	}
};

export { getNetwork };