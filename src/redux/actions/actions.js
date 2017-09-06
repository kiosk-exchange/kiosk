import { buyProduct } from "../../utils/buy";
import {
  MENU_ITEM,
  fetchDataForMenuItem,
  getPriceAndAvailability,
  purchaseIsPending,
  reloadAfterPurchase
} from "./blockchain";

export const SELECTED_MENU_ITEM_ID = "SELECTED_MENU_ITEM_ID";
export const SHOW_BUY_MODAL = "SHOW_BUY_MODAL";
export const SHOW_BUY_KMT_MODAL = "SHOW_BUY_KMT_MODAL";
export const SELECTED_PRODUCT = "SELECTED_PRODUCT";
export const SELECTED_QUANTITY = "QUANTITY";

// Helper function
const action = (type, data) => ({
  type: type,
  ...data
});

// Actions
export const selectedMenuItemId = data =>
  action(SELECTED_MENU_ITEM_ID, { data });
export const selectedProduct = data => action(SELECTED_PRODUCT, { data });
// export const selectedMarket = data => action(SELECTED_MARKET, { data });
export const showBuyModal = data => action(SHOW_BUY_MODAL, { data });
export const showBuyKMTModal = data => action(SHOW_BUY_KMT_MODAL, { data });
export const selectedQuantity = data => action(SELECTED_QUANTITY, { data });

// TestRPC or Kovan
// const isSupportedNetwork = network => {
//   return parseInt(network, 10) > 100 || network === "42";
// };

export const selectMenuItem = id => {
  return async dispatch => {
    dispatch(selectedMenuItemId(id));
    dispatch(fetchDataForMenuItem(id));
  };
};

export const selectProduct = index => {
  return (dispatch, getState) => {
    const menuItem = getState().selectedMenuItemId;
    let product;

    switch (menuItem) {
      case MENU_ITEM.MARKETPLACE:
        const products = getState().results.allProducts;
        product = products[index];
        break;
      default:
        break;
    }

    if (product) {
      dispatch(showBuyModal(true));
      dispatch(selectedProduct(product));
      dispatch(getPriceAndAvailability(product, 1));
    }
  };
};

export const selectMarket = market => {
  return dispatch => {
    console.log("SELECTED MARKET: " + market)
  }
}

export const buyNow = product => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const KMTContract = getState().config.KMTContract;
    const account = getState().config.account;
    const DIN = product.DIN;
    const quantity = getState().buyModal.quantity;
    const value = getState().buyModal.totalPrice;
    const valueInKMTWei = web3.toWei(value, "ether");

    // Reset
    dispatch(purchaseIsPending(true));
    dispatch(showBuyModal(false));
    try {
      const txId = await buyProduct(
        KMTContract,
        DIN,
        quantity,
        valueInKMTWei,
        account
      );
      console.log(txId);
      dispatch(purchaseIsPending(false));
      dispatch(reloadAfterPurchase());
    } catch (err) {
      console.log(err);
      console.log("ERROR: BUY PRODUCT " + product.DIN);
      dispatch(purchaseIsPending(false));
    }
  };
};

// export const buyKioskMarketToken = () => {
//   return async (dispatch, getState) => {
//     try {
//       const web3 = getState().config.web3;
//       const EtherMarket = getState().config.EtherMarket;
//       const value = web3.toWei(1, "ether"); // Hardcode for now
//       const account = getState().config.account;

//       const txId = await buyKMT(EtherMarket, value, account);
//       console.log(txId);
//       // Reload balances
//       dispatch(getBalances());
//     } catch (err) {
//       console.log("ERROR: BUY KMT");
//     }
//   };
// };

export const changedQuantity = quantity => {
  return async (dispatch, getState) => {
    const product = getState().buyModal.product;

    dispatch(selectedQuantity(quantity));
    dispatch(getPriceAndAvailability(product, quantity));
  };
};