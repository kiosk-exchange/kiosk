export const MarketTable = ({ products }) => {
	const headers = ["DIN", "Name", "Price (KMT)", "Buy"];
	const values = ["DIN", "name", "value", "buy"];
	const emptyStateMessage = "You have no purchases";
	return (
		<DataTable dataSource={products} headers={headers} values={values} />
	);
};