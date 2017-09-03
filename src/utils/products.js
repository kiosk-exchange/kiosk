import MarketJSON from "../../build/contracts/Market.json";
const Promise = require("bluebird");

export const getMarketName = (web3, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    try {
      const name = await marketContract.name(marketAddr);
      resolve(name);
    } catch (err) {
      reject(err);
    }
  });
};

export const getValue = (web3, DIN, quantity, buyer, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    const totalPriceAsync = Promise.promisify(marketContract.totalPrice);
    try {
      const priceInKMTWei = await totalPriceAsync(DIN, quantity, buyer);
      const formattedPrice = web3
        .fromWei(priceInKMTWei, "ether")
        .toNumber()
        .toFixed(3);
      resolve(formattedPrice);
    } catch (err) {
      reject(err);
    }
  });
};

export const getName = (web3, DIN, marketAddr) => {
  return new Promise((resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    try {
      // This has to be synchronous because of an error in web3 (invalid BigNumber)
      const name = marketContract.nameOf.call(DIN)
      resolve(name)
    } catch (err) {
      reject(err);
    }
  });
};

export const getIsAvailable = (web3, DIN, quantity, buyer, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    const availableAsync = Promise.promisify(marketContract.availableForSale);
    try {
      const available = await availableAsync(DIN, quantity, buyer);
      resolve(available);
    } catch (err) {
      reject(err);
    }
  });
};

export const getProducts = async (event, DINRegistry, web3, buyer) => {
  const asyncEvent = Promise.promisifyAll(event);
  const logs = await asyncEvent.getAsync();
  const DINs = logs.map(log => {
    return parseInt(log["args"]["DIN"]["c"][0], 10);
  });

  const registry = Promise.promisifyAll(DINRegistry);

  let products = [];
  for (let DIN of DINs) {
    const owner = await registry.ownerAsync(DIN);
    const market = await registry.marketAsync(DIN);

    const product = {
      DIN: DIN,
      seller: owner,
      market: market
    };

    try {
      const name = await getName(web3, DIN, market);
      const value = await getValue(web3, DIN, 1, buyer, market);
      const available = await getIsAvailable(web3, DIN, buyer, 1, market);
      const newProduct = {
        ...product,
        name,
        value,
        available
      };
      products.push(newProduct);
    } catch (err) {
      products.push(product);
    }
  }

  // const nameOfAsync = Promise.promisify(marketContract.nameOf);
  // const name = nameOfAsync(DIN);

  return products;
};

// TODO: This should confirm that the market has not changed
export const getMarketProducts = async (
  web3,
  DINRegistry,
  marketAddr,
  buyer
) => {
  var event = DINRegistry.NewMarket(
    { market: marketAddr },
    { fromBlock: 0, toBlock: "latest" }
  );
  const products = getProducts(event, DINRegistry, web3);
  if (products) {
    return products;
  }
  return [];
};

// TODO: This should confirm that the owner has not changed
export const getOwnerProducts = async (web3, DINRegistry, owner, buyer) => {
  var event = DINRegistry.NewRegistration(
    { owner: owner },
    { fromBlock: 0, toBlock: "latest" }
  );
  const products = getProducts(event, DINRegistry, web3);
  if (products) {
    return products;
  }
  return [];
};

export const getAllProducts = async (DINRegistry, web3, buyer) => {
  var event = DINRegistry.NewRegistration(
    {},
    { fromBlock: 0, toBlock: "latest" }
  );
  const products = getProducts(event, DINRegistry, web3);
  if (products) {
    return products;
  }
  return [];
};