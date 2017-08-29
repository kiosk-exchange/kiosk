import MarketJSON from "../../build/contracts/Market.json";

const getPrice = (web3, DIN, quantity, marketAddr) => {
  return new Promise((resolve, reject) => {
    // Get the market contract from its address
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    marketContract.totalPrice(DIN, quantity, (error, priceInKMTWei) => {
      const price = web3.fromWei(priceInKMTWei, "ether").toNumber().toFixed(3);
      resolve(price);
    });
  });
};

const getName = (web3, DIN, marketAddr) => {
  return new Promise((resolve, reject) => {
    // Get the market contract from its address
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    try {
      const name = marketContract.name(DIN)
      resolve(name)
    } catch (error) {
      // Resolve a blank name if there's a Solidity error
      resolve("N/A")
    }
  });
};

const getIsAvailable = (web3, DIN, quantity, marketAddr) => {
  return new Promise((resolve, reject) => {
    // Get the market contract from its address
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    marketContract.availableForSale(DIN, quantity, (error, isAvailable) => {
      resolve(isAvailable);
    });
  });
};

const productFromDIN = async (DIN, web3, DINRegistry) => {
  return new Promise((resolve, reject) => {
    let product = {
      DIN: DIN,
      name: "",
      owner: "",
      market: "",
      price: "",
      available: false
    };

    const owner = new Promise((resolve, reject) => {
      DINRegistry.owner(DIN, (error, result) => {
        resolve(result);
      });
    });

    const market = new Promise((resolve, reject) => {
      DINRegistry.market(DIN, (error, result) => {
        resolve(result);
      });
    });

    Promise.all([owner, market]).then(results => {
      product.owner = results[0];

      const marketAddr = results[1];

      product.market = marketAddr;

      const name = getName(web3, DIN, marketAddr);
      const price = getPrice(web3, DIN, 1, marketAddr);
      const isAvailable = getIsAvailable(web3, DIN, 1, marketAddr);

      Promise.all([name, price, isAvailable]).then(results => {
        product.name = results[0];
        product.price = results[1];
        product.available = results[2];
        resolve(product);
      });
    });
  });
};

const getProducts = async (event, DINRegistry, web3) => {
  return new Promise(resolve => {
    event.get((error, logs) => {
      const DINs = logs.map(log => {
        return parseInt(log["args"]["DIN"]["c"][0], 10);
      });

      let promises = DINs.map(DIN => {
        return productFromDIN(DIN, web3, DINRegistry);
      });

      Promise.all(promises).then(products => {
        resolve(products);
      });
    });
  });
};

// TODO: This should confirm that the market has not changed
const getMarketProducts = async (DINRegistry, marketAddress, web3) => {
  var event = DINRegistry.NewMarket(
    { market: marketAddress },
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, DINRegistry, web3);
};

// TODO: This should confirm that the owner has not changed
const getOwnerProducts = async (DINRegistry, seller, web3) => {
  var event = DINRegistry.NewRegistration(
    { owner: seller },
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, DINRegistry, web3);
};

const getAllProducts = async (DINRegistry, web3) => {
  var event = DINRegistry.NewRegistration(
    {},
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, DINRegistry, web3);
};

export {
  getMarketProducts,
  getOwnerProducts,
  getAllProducts,
  getPrice,
  getIsAvailable
};