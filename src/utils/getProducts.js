import MarketJSON from "../../build/contracts/StandardMarket.json";

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

const getMarketProducts = async (DINRegistry, marketAddress, web3) => {
  var event = DINRegistry.NewMarket({}, { fromBlock: 0, toBlock: "latest" });
  return getProducts(event, DINRegistry, web3);
};

const getSellerProducts = async (DINRegistry, seller, web3) => {
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

// TODO: FILTER
// function marketFilter(DIN, DINRegistry, marketAddress) {
//   return DINRegistry.market(DIN) === marketAddress;
// }

// function ownerFilter(DIN, DINRegistry, owner) {
//   return DINRegistry.owner(DIN) === owner;
// }

function productFromDIN(DIN, web3, DINRegistry) {
  return new Promise((resolve, reject) => {
    let product = {
      DIN: DIN,
      name: "",
      owner: "",
      market: "",
      price: "",
      available: false
    };

    // TODO: Handle solidity errors
    if (DIN > 1000000001) {
      resolve(product);
      return;
    }

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

      // Get the market contract from its address
      const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);

      const name = new Promise((resolve, reject) => {
        marketContract.name(DIN, (error, name) => {
          resolve(name);
        });
      });

      const price = new Promise((resolve, reject) => {
        marketContract.price(DIN, 1, (error, priceInWei) => {
          const price = web3.fromWei(priceInWei, "ether").toNumber().toFixed(3);
          resolve(price);
        });
      });

      const isAvailable = new Promise((resolve, reject) => {
        marketContract.availableForSale(DIN, 1, (error, isAvailable) => {
          resolve(isAvailable);
        });
      });

      Promise.all([name, price, isAvailable]).then(results => {
        product.name = results[0];
        product.price = results[1];
        product.available = results[2];
        resolve(product);
      });
    });
  });
}

export { getMarketProducts, getSellerProducts, getAllProducts };