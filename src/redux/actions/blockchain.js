import {
  getAllProductDINs,
  getOwnerProductDINs,
  getMarketProductDINs,
  getProduct,
  getValue,
  getIsAvailable
} from "../../utils/products";
import { buyProduct, buyKMT } from "../../utils/buy";
import { getPurchases, getSales } from "../../utils/orders";
import { showBuyModal, showBuyKMTModal } from "./actions";
import { getBalances } from "./config";
const Promise = require("bluebird");

export const REQUEST_LOADING = "REQUEST_LOADING";
export const REQUEST_ERROR = "REQUEST_ERROR";
export const REQUEST_SHOW_LOADER = "SHOW_LOADER";
export const REQUEST_TIMEOUT = "REQUEST_TIMEOUT";
export const RECEIVED_PRODUCT = "RECEIVED_PRODUCT";
export const RECEIVED_OWNER_DINS = "RECEIVED_OWNER_DINS";
export const RECEIVED_MARKET_DINS = "RECEIVED_MARKET_DINS";
export const RECEIVED_PURCHASES = "RECEIVED_PURCHASES";
export const RECEIVED_SALES = "RECEIVED_SALES";
export const TOTAL_PRICE_CALCULATING = "TOTAL_PRICE_CALCULATING";
export const TOTAL_PRICE = "TOTAL_PRICE";
export const PRODUCT_AVAILABILITY = "PRODUCT_AVAILABILITY";
export const TX_PENDING_ADDED = "TX_PENDING_ADDED";
export const TX_PENDING_REMOVED = "TX_PENDING_REMOVED";
export const TX_SUCCEEDED = "TX_SUCCEEDED";
export const SHOW_TX_SUCCEEDED = "SHOW_TX_SUCCEEDED";

export const DATA_TYPE = {
  ALL_PRODUCTS: 1,
  PURCHASES: 2,
  PRODUCTS: 3,
  SALES: 4,
  MARKET: 5
};

const ORDER_TYPE = {
  PURCHASES: "purchases",
  SALES: "sales"
};

const PRODUCT_FILTER = {
  ALL: "all",
  OWNER: "owner"
};

// Helper function
const action = (type, data) => ({
  type: type,
  ...data
});

export const receivedProduct = data => action(RECEIVED_PRODUCT, { data });
export const receivedOwnerDINs = data => action(RECEIVED_OWNER_DINS, { data });
export const receivedMarketDINs = data =>
  action(RECEIVED_MARKET_DINS, { data });
export const receivedPurchases = data => action(RECEIVED_PURCHASES, { data });
export const receivedSales = data => action(RECEIVED_SALES, { data });
export const requestLoading = data => action(REQUEST_LOADING, { data });
export const requestShowLoader = data => action(REQUEST_SHOW_LOADER, { data });
export const requestTimeout = data => action(REQUEST_TIMEOUT, { data });
export const requestError = data => action(REQUEST_ERROR, { data });
export const totalPriceIsCalculating = data =>
  action(TOTAL_PRICE_CALCULATING, { data });
export const totalPrice = data => action(TOTAL_PRICE, { data });
export const productAvailability = data =>
  action(PRODUCT_AVAILABILITY, { data });
export const addPendingTx = data => action(TX_PENDING_ADDED, { data });
export const removePendingTx = data => action(TX_PENDING_REMOVED, { data });
export const txSucceeded = data => action(TX_SUCCEEDED, { data });
export const showTxSucceeded = data => action(SHOW_TX_SUCCEEDED, { data });

const fetchProducts = filter => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const DINRegistry = getState().config.DINRegistry;
    const BuyContract = getState().config.BuyContract;
    const account = getState().config.account;
    const registry = Promise.promisifyAll(DINRegistry);

    if (web3 && DINRegistry && account) {
      let DINs = [];

      if (filter === PRODUCT_FILTER.ALL) {
        DINs = await getAllProductDINs(web3, DINRegistry, BuyContract, account);
      } else if (filter === PRODUCT_FILTER.OWNER) {
        DINs = await getOwnerProductDINs(
          web3,
          DINRegistry,
          BuyContract,
          account,
          account
        );
        dispatch(receivedOwnerDINs(DINs));
      }

      // If no DINs, stop loading right away. Otherwise, do it in the reducer.
      if (DINs.length === 0) {
        dispatch(requestLoading(false));
      } else {
        Promise.each(DINs, DIN => {
          return getProduct(
            web3,
            registry,
            BuyContract,
            account,
            DIN
          ).then(product => {
            dispatch(receivedProduct(product));
          });
        });
      }
    }
  };
};

export const fetchProductsForMarket = market => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const DINRegistry = getState().config.DINRegistry;
    const BuyContract = getState().config.BuyContract;
    const account = getState().config.account;

    if (web3 && DINRegistry && account) {
      const DINs = await getMarketProductDINs(
        web3,
        DINRegistry,
        BuyContract,
        account,
        market
      );
      dispatch(receivedMarketDINs(DINs));
    }
  };
};

const fetchOrders = type => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const OrderStore = getState().config.OrderStore;
    const account = getState().config.account;

    if (OrderStore && web3 && account) {
      if (type === ORDER_TYPE.PURCHASES) {
        const purchases = await getPurchases(OrderStore, web3, account);
        dispatch(receivedPurchases(purchases));
      } else if (type === ORDER_TYPE.SALES) {
        const sales = await getSales(OrderStore, web3, account);
        dispatch(receivedSales(sales));
      }
    }
  };
};

export const reloadAfterPurchase = () => {
  return async dispatch => {
    dispatch(getBalances());
    dispatch(fetchOrders(ORDER_TYPE.PURCHASES));
  };
};

export const fetchDataForMenuItem = id => {
  return async (dispatch, getState) => {
    dispatch(requestError(false));
    dispatch(requestLoading(true));
    try {
      switch (id) {
        case DATA_TYPE.ALL_PRODUCTS:
          dispatch(fetchProducts(PRODUCT_FILTER.ALL));
          break;
        case DATA_TYPE.PURCHASES:
          dispatch(fetchOrders(ORDER_TYPE.PURCHASES));
          break;
        case DATA_TYPE.PRODUCTS:
          dispatch(fetchProducts(PRODUCT_FILTER.OWNER));
          break;
        case DATA_TYPE.SALES:
          dispatch(fetchOrders(ORDER_TYPE.SALES));
          break;
        default:
          break;
      }
    } catch (err) {
      dispatch(requestError(true));
    }
  };
};

export const getPriceAndAvailability = (product, quantity) => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const BuyContract = getState().config.BuyContract;
    const buyer = getState().config.account;

    dispatch(totalPriceIsCalculating(true));

    try {
      const value = await getValue(
        web3,
        BuyContract,
        product.DIN,
        quantity,
        buyer
      );
      dispatch(totalPrice(value));
    } catch (err) {
      //
    }

    try {
      const isAvailable = await getIsAvailable(
        web3,
        BuyContract,
        product.DIN,
        quantity,
        buyer
      );
      dispatch(productAvailability(isAvailable));
    } catch (err) {
      //
    }

    dispatch(totalPriceIsCalculating(false));
  };
};

export const checkPendingTxs = () => {
  return async (dispatch, getState) => {
    try {
      const web3 = getState().config.web3;
      const pendTxs = getState().transactions.pending;
      const getTxAsync = Promise.promisify(web3.eth.getTransaction);

      // TODO: stop polling if pendTxs.length < 1
      pendTxs.forEach(async tx => {
        try {
          const result = await getTxAsync(tx);
          if (result.blockNumber !== null) {
            dispatch(txSucceeded(true));
            dispatch(removePendingTx(tx));
          }
        } catch (err) {
          console.log("ERROR");
        }
      });
    } catch (err) {
      console.log("ERROR: PENDING TRANSACTIONS");
    }
  };
};

export const buyNow = product => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const Buy = getState().config.BuyContract;
    const account = getState().config.account;
    const DIN = product.DIN;
    const quantity = getState().buyModal.quantity;
    const value = getState().buyModal.totalPrice;
    const valueInKMTWei = web3.toWei(value, "ether");

    // Reset
    dispatch(showBuyModal(false));
    try {
      const txId = await buyProduct(
        Buy,
        DIN,
        quantity,
        valueInKMTWei,
        account
      );
      console.log(txId);
      dispatch(addPendingTx(txId));
      setInterval(() => dispatch(checkPendingTxs()), 1000);
      dispatch(reloadAfterPurchase());
    } catch (err) {
      console.log(err);
      console.log("ERROR: BUY PRODUCT " + product.DIN);
    }
  };
};

export const buyKioskMarketToken = (amount) => {
  return async (dispatch, getState) => {
    try {
      const web3 = getState().config.web3;
      const EtherMarket = getState().config.EtherMarket;
      const value = web3.toWei(amount, "ether");
      const account = getState().config.account;

      dispatch(showBuyKMTModal(false))
      buyKMT(EtherMarket, value, account).then((result) => {
        dispatch(getBalances());
        dispatch(addPendingTx(result));
        setInterval(() => dispatch(checkPendingTxs()), 1000);
      })
    } catch (err) {
      console.log("ERROR: BUY KMT");
    }
  };
};
