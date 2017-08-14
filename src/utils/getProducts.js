import MarketJSON from "../../build/contracts/Market.json";

const getMarketDINs = (DINRegistry, marketAddress) =>
  new Promise((resolve, reject) => {
    var DINs = [];

    // Add registration event listener
    var newMarketAll = DINRegistry.NewMarket(
      {},
      { fromBlock: 0, toBlock: "latest" }
    );
    newMarketAll.watch((error, result) => {
      parseResponseMarket(DINs, error, result, resolve, reject, DINRegistry, marketAddress)
      newMarketAll.stopWatching();
    });
  });

const getUserDINs = (DINRegistry, user) =>
  new Promise((resolve, reject) => {
    var DINs = [];

    var newOwnerAll = DINRegistry.NewRegistration(
      { owner: user },
      { fromBlock: 0, toBlock: "latest" }
    );
    newOwnerAll.watch((error, result) => {
      parseResponseOwner(DINs, error, result, resolve, reject, DINRegistry, user)
      newOwnerAll.stopWatching();
    });
  });

const getAllDINs = DINRegistry =>
  new Promise((resolve, reject) => {
    var DINs = [];

    var newRegistrationEvent = DINRegistry.NewRegistration(
      {},
      { fromBlock: 0, toBlock: "latest" }
    );
    newRegistrationEvent.watch((error, result) => {
      parseResponse(DINs, error, result, resolve, reject);
      newRegistrationEvent.stopWatching();
    });
  });

function parseResponse(DINs, error, result, resolve, reject) {
  if (!error) {
    const DIN = parseInt(result["args"]["DIN"]["c"][0], 10);
    if (DINs.includes(DIN) === false) {
      DINs.push(DIN);
    }
  } else {
    reject(error);
  }
  resolve(DINs);
}

function parseResponseOwner(DINs, error, result, resolve, reject, DINRegistry, user) {
  if (!error) {
    const DIN = parseInt(result["args"]["DIN"]["c"][0], 10);
    // Make sure the DIN is still owned by the user and it's not already in the array
    if (DINRegistry.owner(DIN) === user && DINs.includes(DIN) === false) {
      DINs.push(DIN);
    }
  } else {
    reject(error);
  }
  resolve(DINs);
}

function parseResponseMarket(DINs, error, result, resolve, reject, DINRegistry, marketAddress) {
  if (!error) {
    const DIN = parseInt(result["args"]["DIN"]["c"][0], 10);
    // Make sure the DIN is still pointing to given market and it's not already in the array
    if (
      DINRegistry.market(DIN) === marketAddress &&
      DINs.includes(DIN) === false
    ) {
      DINs.push(DIN);
    }
  } else {
    reject(error);
  }
  resolve(DINs);
}

function infoFromDIN(DIN, web3, DINRegistry) {
  let product = {
    DIN: DIN,
    name: "",
    owner: "",
    market: "",
    price: "",
    available: false
  };

  const marketAddr = DINRegistry.market(DIN);

  product.owner = DINRegistry.owner(DIN);
  product.market = marketAddr;

  const market = marketFrom(marketAddr, web3);

  // TODO: Handle Solidity errors
  if (DIN <= 1000000001) {
    product.name = market.name(DIN);
    const priceInWei = market.price(DIN, 1);
    const price = web3.fromWei(priceInWei, "ether").toNumber().toFixed(3);
    product.price = price;
    product.available = market.availableForSale(DIN, 1);
  }

  return product;
}

function marketFrom(address, web3) {
  const marketContract = web3.eth.contract(MarketJSON.abi);
  return marketContract.at(address);
}

export { getMarketDINs, getUserDINs, getAllDINs, infoFromDIN };