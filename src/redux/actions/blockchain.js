import {
  getAllProductDINs,
  getOwnerProductDINs,
  getMarketProductDINs,
  getProduct,
  getValue,
  getIsAvailable
} from "../../utils/products";
import { getPurchases, getSales } from "../../utils/orders";
import { getBalances } from "./config";
const Promise = require("bluebird");

export const REQUEST_LOADING = "REQUEST_LOADING";
export const REQUEST_ERROR = "REQUEST_ERROR";
export const RECEIVED_PRODUCT = "RECEIVED_PRODUCT";
export const RECEIVED_OWNER_DINS = "RECEIVED_OWNER_DINS";
export const RECEIVED_MARKET_DINS = "RECEIVED_MARKET_DINS";
export const RECEIVED_PURCHASES = "RECEIVED_PURCHASES";
export const RECEIVED_SALES = "RECEIVED_SALES";
export const TOTAL_PRICE_CALCULATING = "TOTAL_PRICE_CALCULATING";
export const TOTAL_PRICE = "TOTAL_PRICE";
export const PURCHASE_IS_PENDING = "PURCHASE_IS_PENDING";
export const PRODUCT_AVAILABILITY = "PRODUCT_AVAILABILITY";

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
export const receivedMarketDINs = data => action(RECEIVED_OWNER_DINS, { data });
export const receivedPurchases = data => action(RECEIVED_PURCHASES, { data });
export const receivedSales = data => action(RECEIVED_SALES, { data });
export const requestLoading = data => action(REQUEST_LOADING, { data });
export const requestError = data => action(REQUEST_ERROR, { data });
export const totalPriceIsCalculating = data =>
  action(TOTAL_PRICE_CALCULATING, { data });
export const totalPrice = data => action(TOTAL_PRICE, { data });
export const productAvailability = data =>
  action(PRODUCT_AVAILABILITY, { data });
export const purchaseIsPending = data => action(PURCHASE_IS_PENDING, { data });

const fetchProduct = (web3, registry, BuyerContract, account, DIN) => {
  return async dispatch => {
    const product = await getProduct(
      web3,
      registry,
      BuyerContract,
      account,
      DIN
    );
    dispatch(receivedProduct(product));
  };
};

const fetchProducts = filter => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const DINRegistry = getState().config.DINRegistry;
    const BuyerContract = getState().config.BuyerContract;
    const account = getState().config.account;
    const registry = Promise.promisifyAll(DINRegistry);

    if (web3 && DINRegistry && account) {
      let DINs;

      if (filter === PRODUCT_FILTER.ALL) {
        DINs = await getAllProductDINs(
          web3,
          DINRegistry,
          BuyerContract,
          account
        );
      } else if (filter === PRODUCT_FILTER.OWNER) {
        DINs = await getOwnerProductDINs(
          web3,
          DINRegistry,
          BuyerContract,
          account,
          account
        );
        console.log("1")
        dispatch(receivedOwnerDINs(DINs));
      }
      await DINs.map(async DIN => {
        dispatch(fetchProduct(web3, registry, BuyerContract, account, DIN))
      });
      dispatch(requestLoading(false));
    }
  };
};

export const fetchProductsForMarket = market => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const DINRegistry = getState().config.DINRegistry;
    const BuyerContract = getState().config.BuyerContract;
    const account = getState().config.account;
    if (web3 && DINRegistry && account) {
      const products = await getMarketProductDINs(
        web3,
        DINRegistry,
        BuyerContract,
        account,
        market
      );
      dispatch(receivedMarketDINs(products));
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
  return async dispatch => {
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
    const BuyerContract = getState().config.BuyerContract;
    const buyer = getState().config.account;

    dispatch(totalPriceIsCalculating(true));

    try {
      const value = await getValue(
        web3,
        BuyerContract,
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
        BuyerContract,
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