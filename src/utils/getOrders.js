import { getOrderTracker } from '../utils/contracts'

function date(timestamp) {
  var date = new Date(timestamp*1000)

  var month = date.getUTCMonth() + 1 //months from 1-12
  var day = date.getUTCDate()
  var year = date.getUTCFullYear()

  var formattedDate = month + "/" + day + "/" + year
  return formattedDate
}

const getOrders = (web3, args, blockArgs) =>
  new Promise((resolve, reject) => {
    var orders = [];

    getOrderTracker(web3).then(contract => {
      var fetchOrders = contract.NewOrder(args, blockArgs)
      fetchOrders.watch((error, result) => {
        if (!error) {
          const din = result["args"]["DIN"]["c"][0]
          const quantity = result["args"]["quantity"]["c"][0]
          const market = result["args"]["market"]
          const seller = result["args"]["seller"]
          const buyer = result["args"]["buyer"]
          const orderID = result["args"]["orderID"]["c"][0]
          const info = result["args"]["info"]
          const timestamp = parseInt(result["args"]["timestamp"], 10)

          orders.push({din: din, quantity: quantity, market: market, orderID: orderID, info: info, date: date(timestamp), seller: seller, buyer: buyer})
        } else {
          reject(error)
        }

        resolve(orders);
        fetchOrders.stopWatching();
      })
    })
  });

  export { getOrders };
