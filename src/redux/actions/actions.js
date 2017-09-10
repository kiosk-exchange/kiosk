import {
  DATA_TYPE,
  fetchDataForMenuItem,
  fetchProductsForMarket,
  getPriceAndAvailability
} from "./blockchain";
import { push } from "react-router-redux";

export const SHOW_BUY_MODAL = "SHOW_BUY_MODAL";
export const SHOW_BUY_KMT_MODAL = "SHOW_BUY_KMT_MODAL";
export const SELECTED_PRODUCT = "SELECTED_PRODUCT";
export const SELECTED_QUANTITY = "QUANTITY";
export const SELECTED_MARKET = "SELECTED_MARKET";
export const CHANGED_ETHER_CONTRIBUTION_AMOUNT = "CHANGED_ETHER_CONTRIBUTION_AMOUNT";

// Helper function
const action = (type, data) => ({
  type: type,
  ...data
});

// Actions
export const selectedProduct = data => action(SELECTED_PRODUCT, { data });
export const showBuyModal = data => action(SHOW_BUY_MODAL, { data });
export const showBuyKMTModal = data => action(SHOW_BUY_KMT_MODAL, { data });
export const selectedQuantity = data => action(SELECTED_QUANTITY, { data });
export const selectedMarket = data => action(SELECTED_MARKET, { data });
export const changedEtherContributionAmount = data => action(CHANGED_ETHER_CONTRIBUTION_AMOUNT, { data });
export const selectMenuItem = id => {
  return async dispatch => {
    dispatch(selectedMarket(null));

    switch (id) {
      case DATA_TYPE.ALL_PRODUCTS:
        dispatch(push("/marketplace"));
        break;
      case DATA_TYPE.PURCHASES:
        dispatch(push("/purchases"));
        break;
      case DATA_TYPE.PRODUCTS:
        dispatch(push("/products"));
        break;
      case DATA_TYPE.SALES:
        dispatch(push("/sales"));
        break;
      default:
        break;
    }

    dispatch(fetchDataForMenuItem(id));
  };
};

export const selectProduct = DIN => {
  return (dispatch, getState) => {
    const products = getState().results.products;
    const index = products.findIndex(product => {
      return product.DIN === DIN;
    });
    const product = products[index];

    if (product) {
      dispatch(showBuyModal(true));
      dispatch(selectedProduct(product));
      dispatch(getPriceAndAvailability(product, 1));
    }
  };
};

export const selectMarket = market => {
  return dispatch => {
    dispatch(selectedMarket(market));
    dispatch(fetchProductsForMarket(market.address));
  };
};

export const changedQuantity = quantity => {
  return async (dispatch, getState) => {
    const product = getState().buyModal.product;

    dispatch(selectedQuantity(quantity));
    dispatch(getPriceAndAvailability(product, quantity));
  };
};

export const changeEtherContributionAmount = value => {
  return async (dispatch, getState) => {
    dispatch(changedEtherContributionAmount(value))
  };
};
