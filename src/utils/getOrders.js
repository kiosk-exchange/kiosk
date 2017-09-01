import { getOrderStore} from "../utils/contracts";

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

  const order = {
    orderID: orderID,
    buyer: buyer,
    seller: seller,
    market: market,
    DIN: DIN,
    info: info,
    value: value,
    quantity: quantity,
    date: date(timestamp)
  };

  return order;
};

const getOrders = (web3, args) => {
  return new Promise(resolve => {
    getOrderStore(web3).then(contract => {
      var event = contract.NewOrder(args, {
        fromBlock: 0,
        toBlock: "latest"
      });
      event.get((error, logs) => {
        if (!error) {
          const orders = logs.map(log => {
            const order = orderFromLog(log, web3);
            return order;
          });
          resolve(orders);
        }
      });
    });
  });
};

const getPurchases = (web3, buyer) => {
  return getOrders(web3, { buyer: buyer });
};

const getSales = (web3, seller) => {
  return getOrders(web3, { seller: seller });
};

export { getPurchases, getSales };