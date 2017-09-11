function date(timestamp) {
  var date = new Date(timestamp * 1000);

  var month = date.getUTCMonth() + 1; //months from 1-12
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();

  var formattedDate = month + "/" + day + "/" + year;
  return formattedDate;
}

const orderFromLog = (result, web3) => {
  const orderID = result["args"]["orderID"]["c"][0];
  const buyer = result["args"]["buyer"];
  const seller = result["args"]["seller"];
  const market = result["args"]["market"];
  const DIN = result["args"]["DIN"]["c"][0];
  const info = result["args"]["info"];
  const value = web3
    .fromWei(result["args"]["value"], "ether")
    .toNumber()
    .toFixed(3);
  const quantity = result["args"]["quantity"]["c"][0];
  const timestamp = parseInt(result["args"]["timestamp"], 10);

  let metadata = result["args"]["metadata"];
  if (DIN === 1000000000) {
    metadata = parseInt(metadata, 16)
  }

  const order = {
    orderID: orderID,
    buyer: buyer,
    seller: seller,
    market: market,
    DIN: DIN,
    info: info,
    value: value,
    quantity: quantity,
    metadata: metadata,
    date: date(timestamp)
  };

  return order;
};

const getOrders = (orderStore, web3, user) => {
  return new Promise(resolve => {
    var event = orderStore.NewOrder(user, {
      fromBlock: 0,
      toBlock: "latest"
    });
    event.get((error, logs) => {
      if (!error) {
        const orders = logs.map(log => {
          return orderFromLog(log, web3);
        });
        resolve(orders);
      }
    });
  });
};

const getPurchases = (orderStore, web3, buyer) => {
  return getOrders(orderStore, web3, { buyer: buyer });
};

const getSales = (orderStore, web3, seller) => {
  return getOrders(orderStore, web3, { seller: seller });
};

export { getPurchases, getSales };