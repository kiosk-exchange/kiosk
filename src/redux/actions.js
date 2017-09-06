// TODO: Extract into kiosk.js node module
import {
  getAccountsAsync,
  getNetworkAsync,
  getKMTBalanceAsync,
  getETHBalanceAsync
} from "../utils/kioskWeb3";
import {
  getKioskMarketToken,
  getBuyer,
  getDINRegistry,
  getOrderStore,
  getEtherMarket
} from "../utils/contracts";
import {
  getAllProducts,
  getOwnerProducts,
  getValue,
  getIsAvailable
} from "../utils/products";
import { getPurchases, getSales } from "../utils/orders";
import { buyProduct, buyKMT } from "../utils/buy";
import { loadWeb3 } from "../utils/kioskWeb3";

// Action stubs
export const WEB_3_LOADING = "WEB_3_LOADING";
export const WEB_3_ERROR = "WEB_3_ERROR";
export const WEB_3_SUCCESS = "WEB_3_SUCCESS";
export const ACCOUNT_ERROR = "ACCOUNT_ERROR";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";
export const NETWORK_ERROR = "NETWORK_ERROR";
export const NETWORK_SUCCESS = "NETWORK_SUCCESS";
export const KMT_CONTRACT = "KMT_CONTRACT";
export const BUYER_CONTRACT = "BUYER_CONTRACT";
export const DIN_REGISTRY_CONTRACT = "DIN_REGISTRY_CONTRACT";
export const ORDER_STORE_CONTRACT = "ORDER_STORE_CONTRACT";
export const ETHER_MARKET_CONTRACT = "ETHER_MARKET_CONTRACT";
export const KMT_BALANCE = "KMT_BALANCE";
export const ETH_BALANCE = "ETH_BALANCE";
export const SELECTED_MENU_ITEM_ID = "SELECTED_MENU_ITEM_ID";
export const REQUEST_LOADING = "REQUEST_LOADING";
export const REQUEST_ERROR = "REQUEST_ERROR";
export const RECEIVED_ALL_PRODUCTS = "RECEIVED_ALL_PRODUCTS";
export const RECEIVED_OWNER_PRODUCTS = "RECEIVED_OWNER_PRODUCTS";
export const RECEIVED_PURCHASES = "RECEIVED_PURCHASES";
export const RECEIVED_SALES = "RECEIVED_SALES";

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
export const web3IsLoading = data => action(WEB_3_LOADING, { data });
export const web3HasError = data => action(WEB_3_ERROR, { data });
export const web3Success = data => action(WEB_3_SUCCESS, { data });
export const accountHasError = data => action(ACCOUNT_ERROR, { data });
export const accountSuccess = data => action(ACCOUNT_SUCCESS, { data });
export const networkHasError = data => action(NETWORK_ERROR, { data });
export const networkSuccess = data => action(NETWORK_SUCCESS, { data });
export const KMTContract = data => action(KMT_CONTRACT, { data });
export const BuyerContract = data => action(BUYER_CONTRACT, { data });
export const DINRegistryContract = data =>
  action(DIN_REGISTRY_CONTRACT, { data });
export const OrderStoreContract = data =>
  action(ORDER_STORE_CONTRACT, { data });
export const EtherMarketContract = data =>
  action(ETHER_MARKET_CONTRACT, { data });
export const KMTBalance = data => action(KMT_BALANCE, { data });
export const ETHBalance = data => action(ETH_BALANCE, { data });
export const selectedMenuItemId = data =>
  action(SELECTED_MENU_ITEM_ID, { data });
export const requestLoading = data => action(REQUEST_LOADING, { data });
export const requestError = data => action(REQUEST_ERROR, { data });
export const receivedAllProducts = data =>
  action(RECEIVED_ALL_PRODUCTS, { data });
export const receivedOwnerProducts = data =>
  action(RECEIVED_OWNER_PRODUCTS, { data });
export const receivedPurchases = data => action(RECEIVED_PURCHASES, { data });
export const receivedSales = data => action(RECEIVED_SALES, { data });
export const selectedProduct = data => action(SELECTED_PRODUCT, { data });
export const showBuyModal = data => action(SHOW_BUY_MODAL, { data });
export const showBuyKMTModal = data => action(SHOW_BUY_KMT_MODAL, { data });
export const purchaseIsPending = data => action(PURCHASE_IS_PENDING, { data });
export const selectedQuantity = data => action(SELECTED_QUANTITY, { data });
export const totalPriceIsCalculating = data =>
  action(TOTAL_PRICE_CALCULATING, { data });
export const totalPrice = data => action(TOTAL_PRICE, { data });
export const productAvailability = data =>
  action(PRODUCT_AVAILABILITY, { data });

const getAccount = () => {
  return async (dispatch, getState) => {
    const accounts = await getAccountsAsync(getState().config.web3);
    if (accounts.length > 0) {
      const account = accounts[0];
      dispatch(accountSuccess(account));
    } else {
      dispatch(accountHasError(true));
    }
  };
};

// TestRPC or Kovan
// const isSupportedNetwork = network => {
//   return parseInt(network, 10) > 100 || network === "42";
// };

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

const getNetwork = () => {
  return async (dispatch, getState) => {
    const network = await getNetworkAsync(getState().config.web3);
    if (network) {
      dispatch(networkSuccess(network));
    } else {
      dispatch(networkHasError(true));
    }
  };
};

const getBalances = () => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const KMTContract = getState().config.KMTContract;
    const account = getState().config.account;

    if (web3 && KMTContract && account) {
      const KMT = await getKMTBalanceAsync(web3, KMTContract, account);
      dispatch(KMTBalance(KMT));

      const ETH = await getETHBalanceAsync(web3, account);
      dispatch(ETHBalance(ETH));
    }
  };
};

const fetchProducts = filter => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;
    const DINRegistry = getState().config.DINRegistry;
    const BuyerContract = getState().config.BuyerContract;
    const account = getState().config.account;

    if (DINRegistry && web3 && account) {
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

export const fetchDataForMenuItem = id => {
  return async dispatch => {
    dispatch(selectedMenuItemId(id));
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

const getContracts = () => {
  return async (dispatch, getState) => {
    const web3 = getState().config.web3;

    try {
      const KMT = await getKioskMarketToken(web3);
      const Buyer = await getBuyer(web3);
      const DINRegistry = await getDINRegistry(web3);
      const OrderStore = await getOrderStore(web3);
      const EtherMarket = await getEtherMarket(web3);

      dispatch(KMTContract(KMT));
      dispatch(BuyerContract(Buyer));
      dispatch(DINRegistryContract(DINRegistry));
      dispatch(OrderStoreContract(OrderStore));
      dispatch(EtherMarketContract(EtherMarket));

      dispatch(fetchDataForMenuItem(MENU_ITEM.MARKETPLACE));
      dispatch(getBalances());
    } catch (err) {
      console.log("ERROR: GET CONTRACTS");
    }
  };
};

const refreshNetwork = () => {
  return async (dispatch, getState) => {
    const currentWeb3 = getState().config.web3;
    const KMT = getState().config.KMTContract;

    if (currentWeb3) {
      // Refresh every second
      // Get account
      dispatch(getAccount());
      // Get network
      dispatch(getNetwork());

      if (!KMT) {
        // Get contracts
        dispatch(getContracts());
      }
    } else {
      try {
        const web3 = await loadWeb3();
        dispatch(web3Success(web3));
        dispatch(web3HasError(false));
      } catch (err) {
        dispatch(web3HasError(true));
      }
    }
  };
};

// Fetch web3, contracts, account and dispatch to store
export const initKiosk = () => {
  return async dispatch => {
    setInterval(() => dispatch(refreshNetwork()), 1000);
  };
};

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

    if (product) {
      dispatch(showBuyModal(true));
      dispatch(selectedProduct(product));
      dispatch(getPriceAndAvailability(product, 1));
    }
  };
};

const reloadAfterPurchase = () => {
  return async dispatch => {
    dispatch(getBalances());
    dispatch(fetchOrders(ORDER_TYPE.PURCHASES));
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