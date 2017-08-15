import { getOrderTracker } from "../utils/contracts";

function date(timestamp) {
  var date = new Date(timestamp * 1000);

  var month = date.getUTCMonth() + 1; //months from 1-12
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();

  var formattedDate = month + "/" + day + "/" + year;
  return formattedDate;
}

const getOrders = (web3, args, blockArgs) =>
  new Promise((resolve, reject) => {
    var orders = [];

    getOrderTracker(web3).then(contract => {
      var fetchOrders = contract.NewOrder(args, blockArgs);
      fetchOrders.watch((error, result) => {
        if (!error) {
          const orderID = result["args"]["orderID"]["c"][0];
          const buyer = result["args"]["buyer"];
          const seller = result["args"]["seller"];
          const market = result["args"]["market"];
          const DIN = result["args"]["DIN"]["c"][0];
          const info = result["args"]["info"];
          const value = web3.fromWei(result["args"]["value"], 'ether').toNumber().toFixed(3);
          const quantity = result["args"]["quantity"]["c"][0];
          const timestamp = parseInt(result["args"]["timestamp"], 10);

          orders.push({
            orderID: orderID,
            buyer: buyer,
            seller: seller,
            market: market,
            din: DIN,
            info: info,
            value: value,
            quantity: quantity,
            date: date(timestamp)
          });
        } else {
          reject(error);
        }

        resolve(orders);
        fetchOrders.stopWatching();
      });
    });
  });

export { getOrders };