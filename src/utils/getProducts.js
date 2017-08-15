import MarketJSON from "../../build/contracts/Market.json";

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