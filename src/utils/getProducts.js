const getProducts = (DINRegistry, DINRegistrar) => new Promise((resolve, reject) => {

  var products = []

  // Add registration event listener
  var newRegistrationAll = DINRegistrar.NewRegistration({}, {fromBlock: 0, toBlock: 'latest'})
  newRegistrationAll.watch((error, result) => {

    if (!error) {

      const DIN = parseInt(result["args"]["DIN"]["c"][0], 10)
      products.push({ DIN: DIN })

    } else {
      reject(error)
    }

    resolve(products)

    newRegistrationAll = null
  })

})

export default getProducts