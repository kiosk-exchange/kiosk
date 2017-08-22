import MarketJSON from "../../build/contracts/StandardMarket.json";

const getMarketDINs = (DINRegistry, marketAddress) =>
  new Promise((resolve, reject) => {
    var DINs = [];
    var event = DINRegistry.NewMarket({}, { fromBlock: 0, toBlock: "latest" });
    getDINs(event, DINs, resolve, reject, marketFilter, [
      DINRegistry,
      marketAddress
    ]);
  });

const getUserDINs = (DINRegistry, user) =>
  new Promise((resolve, reject) => {
    var DINs = [];
    var event = DINRegistry.NewRegistration(
      { owner: user },
      { fromBlock: 0, toBlock: "latest" }
    );
    getDINs(event, DINs, resolve, reject, ownerFilter, [DINRegistry, user]);
  });

const getAllDINs = DINRegistry =>
  new Promise((resolve, reject) => {
    var DINs = [];
    var event = DINRegistry.NewRegistration(
      {},
      { fromBlock: 0, toBlock: "latest" }
    );
    getDINs(event, DINs, resolve, reject, null, null);
  });

function getDINs(event, DINs, resolve, reject, filter, filterArgs) {
  event.watch((error, result) => {
    parseResponse(DINs, error, result, resolve, reject, filter, filterArgs);
    event.stopWatching();
  });
}

function parseResponse(
  DINs,
  error,
  result,
  resolve,
  reject,
  filter,
  filterArgs
) {
  if (!error) {
    const DIN = parseInt(result["args"]["DIN"]["c"][0], 10);
    if (filter && filterArgs) {
      const args = [DIN].concat(filterArgs);
      if (filter.apply(this, args) === true) {
        DINs.push(DIN);
      }
    } else {
      DINs.push(DIN);
    }
  } else {
    reject(error);
  }

  resolve(DINs);
}

function marketFilter(DIN, DINRegistry, marketAddress) {
  return DINRegistry.market(DIN) === marketAddress;
}

function ownerFilter(DIN, DINRegistry, owner) {
  return DINRegistry.owner(DIN) === owner;
}

function infoFromDIN(DIN, web3, DINRegistry) {
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

export { getMarketDINs, getUserDINs, getAllDINs, infoFromDIN };