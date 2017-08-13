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
      newMarketAll.stopWatching();
    });
  });

const getUserDINs = (DINRegistry, user) =>
  new Promise((resolve, reject) => {
    var DINs = [];

    var newOwnerAll = DINRegistry.NewOwner(
      { owner: user },
      { fromBlock: 0, toBlock: "latest" }
    );
    newOwnerAll.watch((error, result) => {
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

function infoFromDIN(DIN, web3, DINRegistry) {
  let product = {
    DIN: DIN,
    name: "",
    owner: "",
    market: ""
  };

  const marketAddr = DINRegistry.market(DIN)

  product.owner = DINRegistry.owner(DIN);
  product.market = marketAddr;

  const market = marketFrom(marketAddr, web3)

  // TODO: Handle Solidity errors
  if (DIN <= 1000000001) {
    product.name = market.name(DIN);
  }

  return product;
}

function marketFrom(address, web3) {
  const marketContract = web3.eth.contract(MarketJSON.abi);
  return marketContract.at(address);
}

function productFromDIN(DIN, web3, marketAddr) {
  var product = {
    DIN: DIN,
    price: null,
    formattedPrice: null,
    name: null
  };

  const market = marketFrom(marketAddr, web3);

  // Get the price from the perspective of the null account. Otherwise, price will show up as zero if the buyer is also the seller.
  const price = market.price(DIN, 1)
  product.price = price;
  product.formattedPrice = web3.fromWei(price, "ether").toNumber().toFixed(3);

  // TODO: This logic should not be ENS specific!
  // const node = market.ENSNode(DIN);
  // product.node = node;

  const name = market.name(DIN);
  product.name = name;

  // If the product is available for sale, show a "Buy Now" button
  if (market.availableForSale(product.DIN) === true) {
    product.available = true;
  } else {
    product.available = false;
  }

  return product;
}

export { getMarketDINs, getUserDINs, getAllDINs, infoFromDIN, productFromDIN };
