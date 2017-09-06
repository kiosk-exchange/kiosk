import { buyProduct, buyKMT } from "../utils/buy";
import { MENU_ITEM, fetchDataForMenuItem } from "./blockchain";

export const SELECTED_MENU_ITEM_ID = "SELECTED_MENU_ITEM_ID";

// Buy Modal
export const SHOW_BUY_MODAL = "SHOW_BUY_MODAL";
export const SHOW_BUY_KMT_MODAL = "SHOW_BUY_KMT_MODAL";
export const SELECTED_PRODUCT = "SELECTED_PRODUCT";
export const SELECTED_QUANTITY = "QUANTITY";
export const TOTAL_PRICE_CALCULATING = "TOTAL_PRICE_CALCULATING";
export const TOTAL_PRICE = "TOTAL_PRICE";
export const PRODUCT_AVAILABILITY = "PRODUCT_AVAILABILITY";
export const PURCHASE_IS_PENDING = "PURCHASE_IS_PENDING";

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
export const purchaseIsPending = data => action(PURCHASE_IS_PENDING, { data });
export const selectedQuantity = data => action(SELECTED_QUANTITY, { data });
export const totalPriceIsCalculating = data =>
  action(TOTAL_PRICE_CALCULATING, { data });
export const totalPrice = data => action(TOTAL_PRICE, { data });
export const productAvailability = data =>
  action(PRODUCT_AVAILABILITY, { data });


// TestRPC or Kovan
// const isSupportedNetwork = network => {
//   return parseInt(network, 10) > 100 || network === "42";
// };

export const selectMenuItem = id => {
  return async dispatch => {
    dispatch(fetchDataForMenuItem(id));
  };
};

const getPriceAndAvailability = (product, quantity) => {
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

    if (product) 
      dispatch(showBuyModal(true));
      dispatch(selectedProduct(product));
      dispatch(getPriceAndAvailability(product, 1));
    }
  };
};

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
//   return dispatch => {
//     dispatch();
//   }
// }

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

// action(SELECTED_QUANTITY, { data });

// const ERROR = {
//   NOT_CONNECTED: 1,
//   CONTRACTS_NOT_DEPLOYED: 2,
//   NETWORK_NOT_SUPPORTED: 3,
//   LOCKED_ACCOUNT: 4
// };