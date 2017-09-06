import {
  getAllProducts,
  getOwnerProducts,
  getMarketProducts,
  getValue,
  getIsAvailable
} from "../../utils/products";
import { getPurchases, getSales } from "../../utils/orders";
import { getBalances } from "./config";

export const REQUEST_LOADING = "REQUEST_LOADING";
export const REQUEST_ERROR = "REQUEST_ERROR";
export const RECEIVED_ALL_PRODUCTS = "RECEIVED_ALL_PRODUCTS";
export const RECEIVED_OWNER_PRODUCTS = "RECEIVED_OWNER_PRODUCTS";
export const RECEIVED_MARKET_PRODUCTS = "RECEIVED_MARKET_PRODUCTS";
export const RECEIVED_PURCHASES = "RECEIVED_PURCHASES";
export const RECEIVED_SALES = "RECEIVED_SALES";
export const TOTAL_PRICE_CALCULATING = "TOTAL_PRICE_CALCULATING";
export const TOTAL_PRICE = "TOTAL_PRICE";
export const PURCHASE_IS_PENDING = "PURCHASE_IS_PENDING";
export const PRODUCT_AVAILABILITY = "PRODUCT_AVAILABILITY";

export const MENU_ITEM = {
  MARKETPLACE: 1,
  PURCHASES: 2,
  PRODUCTS: 3,
  SALES: 4
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

export const receivedAllProducts = data =>
  action(RECEIVED_ALL_PRODUCTS, { data });
export const receivedOwnerProducts = data =>
  action(RECEIVED_OWNER_PRODUCTS, { data });
export const receivedMarketProducts = data => action(RECEIVED_MARKET_PRODUCTS, { data });
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

const fetchProducts = filter => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const DINRegistry = getState().config.DINRegistry;
    const BuyerContract = getState().config.BuyerContract;
    const account = getState().config.account;

    if (web3 && DINRegistry && account) {
      if (filter === PRODUCT_FILTER.ALL) {
        const products = await getAllProducts(
          web3,
          DINRegistry,
          BuyerContract,
          account
        );
        dispatch(receivedAllProducts(products));
      } else if (filter === PRODUCT_FILTER.OWNER) {
        const products = await getOwnerProducts(
          web3,
          DINRegistry,
          BuyerContract,
          account,
          account
        );
        dispatch(receivedOwnerProducts(products));
      }
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
      const products = await getMarketProducts(
        web3,
        DINRegistry,
        BuyerContract,
        account,
        market
      )
      dispatch(receivedMarketProducts(products))
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
        case MENU_ITEM.MARKETPLACE:
          await dispatch(fetchProducts(PRODUCT_FILTER.ALL));
          break;
        case MENU_ITEM.PURCHASES:
          await dispatch(fetchOrders(ORDER_TYPE.PURCHASES));
          break;
        case MENU_ITEM.PRODUCTS:
          await dispatch(fetchProducts(PRODUCT_FILTER.OWNER));
          break;
        case MENU_ITEM.SALES:
          await dispatch(fetchOrders(ORDER_TYPE.SALES));
          break;
        default:
          break;
      }
    } catch (err) {
      dispatch(requestError(true));
    }

    dispatch(requestLoading(false));
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