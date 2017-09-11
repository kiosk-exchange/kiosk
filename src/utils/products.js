import MarketJSON from "../../build/contracts/Market.json";
var coder = require("web3/lib/solidity/coder");
const Promise = require("bluebird");
const CryptoJS = require("crypto-js");

const encodeFunctionTxData = (functionName, types, args) => {
  const fullName = functionName + "(" + types.join() + ")";
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 })
    .toString(CryptoJS.enc.Hex)
    .slice(0, 8);
  var dataHex = "0x" + signature + coder.encodeParams(types, args);
  return dataHex;
};

export const getMarketName = (web3, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    const callAsync = Promise.promisify(web3.eth.call);

    const nameData = encodeFunctionTxData("name", [], []);
    const result = await callAsync({
      to: marketAddr,
      data: nameData
    });

    if (result === "0x") {
      resolve("");
    } else {
      // Sometimes web3 to Ascii on the result is slightly wrong, so make request directly
      const nameAsync = Promise.promisify(marketContract.name);
      const name = await nameAsync();
      resolve(name);
    }
  });
};

export const getProductName = (web3, DIN, marketAddr) => {
  return new Promise(async (resolve, reject) => {
    const marketContract = web3.eth.contract(MarketJSON.abi).at(marketAddr);
    const callAsync = Promise.promisify(web3.eth.call);

    // Some nonsense to work around Solidity errors
    const nameOfData = encodeFunctionTxData("nameOf", ["uint256"], [DIN]);
    const result = await callAsync({
      to: marketAddr,
      data: nameOfData
    });

    if (result === "0x") {
      resolve("");
    } else {
      // Sometimes web3 to Ascii on the result is slightly wrong, so make request directly
      const nameOfAsync = Promise.promisify(marketContract.nameOf);
      const name = await nameOfAsync(DIN);
      resolve(name);
    }
  });
};

export const getValue = (web3, BuyContract, DIN, quantity, buyerAcct) => {
  return new Promise(async (resolve, reject) => {
    const totalPriceAsync = Promise.promisify(BuyContract.totalPrice);
    try {
      const priceInKMTWei = await totalPriceAsync(DIN, quantity, buyerAcct);
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

export const getIsAvailable = (
  web3,
  BuyContract,
  DIN,
  quantity,
  buyerAcct
) => {
  return new Promise(async (resolve, reject) => {
    const availableAsync = Promise.promisify(BuyContract.availableForSale);
    try {
      const available = await availableAsync(DIN, quantity, buyerAcct);
      resolve(available);
    } catch (err) {
      reject(err);
    }
  });
};

// // Only show products where the market is set and with a name
// const filteredProducts = products.filter(
//   product =>
//     product.market !== "0x0000000000000000000000000000000000000000" &&
//     product.name
// );

// return filteredProducts;

export const getProduct = async (
  web3,
  registry,
  BuyContract,
  buyerAcct,
  DIN
) => {
  const owner = await registry.ownerAsync(DIN);
  const market = await registry.marketAsync(DIN);

  const product = {
    DIN: DIN,
    seller: owner,
    market: market
  };

  try {
    const name = await getProductName(web3, DIN, market);
    const value = await getValue(web3, BuyContract, DIN, 1, buyerAcct);
    const available = await getIsAvailable(
      web3,
      BuyContract,
      DIN,
      buyerAcct,
      1
    );
    const marketName = await getMarketName(web3, market);
    const fullProduct = {
      ...product,
      name,
      value,
      available,
      marketName
    };
    return fullProduct;
  } catch (err) {
    return product;
  }
};

const getProducts = async (
  event,
  web3,
  DINRegistry,
  BuyContract,
  buyerAcct
) => {
  const asyncEvent = Promise.promisifyAll(event);
  const logs = await asyncEvent.getAsync();
  const DINs = logs.map(log => {
    return parseInt(log["args"]["DIN"]["c"][0], 10);
  });

  return DINs;
};

// TODO: This should confirm that the market has not changed
export const getMarketProductDINs = async (
  web3,
  DINRegistry,
  BuyContract,
  buyerAcct,
  marketAddr
) => {
  var event = DINRegistry.NewMarket(
    { market: marketAddr },
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, web3, DINRegistry, BuyContract, buyerAcct);
};

// TODO: This should confirm that the owner has not changed
export const getOwnerProductDINs = async (
  web3,
  DINRegistry,
  BuyContract,
  owner,
  buyerAcct
) => {
  var event = DINRegistry.NewRegistration(
    { owner: owner },
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, web3, DINRegistry, BuyContract, buyerAcct);
};

export const getAllProductDINs = async (
  web3,
  DINRegistry,
  BuyContract,
  buyerAcct
) => {
  var event = DINRegistry.NewRegistration(
    {},
    { fromBlock: 0, toBlock: "latest" }
  );
  return getProducts(event, web3, DINRegistry, BuyContract, buyerAcct);
};