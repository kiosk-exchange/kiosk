import MarketJSON from "../../build/contracts/Market.json";
const Promise = require("bluebird");

export const getMarketName = (web3, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    const nameAsync = Promise.promisify(marketContract.name);
    try {
      const name = await nameAsync(marketAddr);
      resolve(name);
    } catch (err) {
      reject(err);
    }
  });
};

export const getValue = async (web3, DIN, quantity, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    try {
      const priceInKMTWei = await marketContract.totalPrice(DIN, quantity);
      const formattedPrice = web3
        .fromWei(priceInKMTWei, "ether")
        .toNumber()
        .toFixed(3);
      resolve(formattedPrice);
    } catch (err) {
      console.log("ERROR: PRODUCT PRICE")
      reject(err);
    }
  });
};

export const getName = async (web3, DIN, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    try {
      const name = await marketContract.nameOf(DIN);
      resolve(name);
    } catch (err) {
      reject(err);
    }
  });
};

export const getIsAvailable = (web3, DIN, quantity, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    const availableForSaleAsync = Promise.promisify(
      marketContract.availableForSale
    );
    try {
      const available = availableForSaleAsync(DIN, quantity);
      resolve(available);
    } catch (err) {
      reject(err);
    }
  });
};

export const productFromDIN = async (DIN, web3, DINRegistry) => {
    let product = {
      DIN: DIN,
      available: false
    };

    const registry = Promise.promisifyAll(DINRegistry);

    const owner = await registry.ownerAsync(DIN);
    const market = await registry.marketAsync(DIN);

    product.seller = owner;
    product.market = market;

    try {
      const name = await getName(web3, DIN, market);
      const value = await getValue(web3, DIN, 1, market);
      const available = await getIsAvailable(web3, DIN, 1, market);

      product.name = name;
      product.value = value;
      product.available = available;
      return product;
    } catch (err) {
      return product;
    }
};

export const getProducts = async (event, DINRegistry, web3) => {
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
export const getMarketProducts = async (DINRegistry, marketAddress, web3) => {
  var event = DINRegistry.NewMarket(
    { market: marketAddress },
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, DINRegistry, web3);
};

// TODO: This should confirm that the owner has not changed
export const getOwnerProducts = async (DINRegistry, web3, owner) => {
  var event = DINRegistry.NewRegistration(
    { owner: owner },
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, DINRegistry, web3);
};

export const getAllProducts = async (DINRegistry, web3) => {
  var event = DINRegistry.NewRegistration(
    {},
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, DINRegistry, web3);
};