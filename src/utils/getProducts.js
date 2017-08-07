const getProducts = (DINRegistry, marketAddress) => new Promise((resolve, reject) => {

  var products = []

  // Add registration event listener
  var newMarketAll = DINRegistry.NewMarket({market: marketAddress}, {fromBlock: 0, toBlock: 'latest'})
  newMarketAll.watch((error, result) => {
    if (!error) {
      const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)

      // Make sure the DIN is still pointing to given market
      if (DINRegistry.market(DIN) === marketAddress) {
        products.push({ DIN: DIN })
      }

    } else {
      reject(error)
    }
    resolve(products)
    newMarketAll.stopWatching()
  })

})

export default getProducts