const getMarketDINs = (DINRegistry, marketAddress) => new Promise((resolve, reject) => {

  var DINs = []

  // Add registration event listener
  var newMarketAll = DINRegistry.NewMarket({}, {fromBlock: 0, toBlock: 'latest'})
  newMarketAll.watch((error, result) => {
    if (!error) {
      const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)

      // Make sure the DIN is still pointing to given market and it's not already in the array
      if (DINRegistry.market(DIN) === marketAddress && DINs.includes(DIN) === false) {
        DINs.push(DIN)
      }

    } else { 
      reject(error)
    }
    resolve(DINs)
    newMarketAll.stopWatching()
  })

})

const getUserDINs = (DINRegistry, user) => new Promise((resolve, reject) => {

  var DINs = []

  var newOwnerAll = DINRegistry.NewOwner({owner: user}, {fromBlock: 0, toBlock: 'latest'})
  newOwnerAll.watch((error, result) => {
    if (!error) {
      const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)

      // Make sure the DIN is still owned by the user and it's not already in the array
      // TODO: It seems like there are 2 events for each DIN?
      if (DINRegistry.owner(DIN) === user && DINs.includes(DIN) === false) {
        DINs.push(DIN)
      }

    } else {
      reject(error)
    }
    resolve(DINs)
    newOwnerAll.stopWatching()
  })

})

function productFromDIN(DIN, web3, market) {
  var product = {
    DIN: DIN,
    price: null,
    formattedPrice: null,
    node: null,
    name: null
  }

  // Get the price from the perspective of the null account. Otherwise, price will show up as zero if the buyer is also the seller.
  const price = market.totalPrice(DIN, 1, {from: '0x0000000000000000000000000000000000000000'}).toNumber()
  product.price = price
  product.formattedPrice = web3.fromWei(price, 'ether')

  // TODO: This logic should not be ENS specific!
  const node = market.ENSNode(DIN)
  product.node = node

  const name = market.name(DIN)
  product.name = name

  // If the product is available for sale, show a "Buy Now" button
  if (market.isAvailableForSale(product.DIN) === true) {
    product.available = true
  } else {
    product.available = false
  }

  return product
}

export { getMarketDINs, getUserDINs, productFromDIN }