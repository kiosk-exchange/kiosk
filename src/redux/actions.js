// This will contain all actions related to web3 / kiosk
import {
  loadWeb3,
  getAccountsAsync,
  getNetworkAsync,
  getKMTBalanceAsync,
  getETHBalanceAsync
} from "../utils/kioskWeb3";
import { getKioskMarketToken, getDINRegistry, getOrderStore } from "../utils/contracts";
import { getAllProducts, getOwnerProducts } from "../utils/products";
import { getPurchases, getSales } from "../utils/orders";

export const WEB_3_LOADING = "WEB_3_LOADING";
export const WEB_3_ERROR = "WEB_3_ERROR";
export const WEB_3_SUCCESS = "WEB_3_SUCCESS";
export const ACCOUNT_ERROR = "ACCOUNT_ERROR";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";
export const NETWORK_ERROR = "NETWORK_ERROR";
export const NETWORK_SUCCESS = "NETWORK_SUCCESS";
export const KMT_CONTRACT = "KMT_CONTRACT";
export const DIN_REGISTRY_CONTRACT = "DIN_REGISTRY_CONTRACT";
export const ORDER_STORE_CONTRACT = "ORDER_STORE_CONTRACT";
export const KMT_BALANCE = "KMT_BALANCE";
export const ETH_BALANCE = "ETH_BALANCE";
export const SELECTED_MENU_ITEM_ID = "SELECTED_MENU_ITEM_ID";
export const RECEIVED_ALL_PRODUCTS = "RECEIVED_ALL_PRODUCTS";
export const RECEIVED_OWNER_PRODUCTS = "RECEIVED_OWNER_PRODUCTS";
export const RECEIVED_PURCHASES = "RECEIVED_PURCHASES";
export const RECEIVED_SALES = "RECEIVED_SALES";

// Helper function
const action = (type, data) => ({
  type: type,
  ...data
});

// Config
export const web3IsLoading = data => action(WEB_3_LOADING, { data });
export const web3HasError = data => action(WEB_3_ERROR, { data });
export const web3Success = data => action(WEB_3_SUCCESS, { data });
export const accountHasError = data => action(ACCOUNT_ERROR, { data });
export const accountSuccess = data => action(ACCOUNT_SUCCESS, { data });
export const networkHasError = data => action(NETWORK_ERROR, { data });
export const networkSuccess = data => action(NETWORK_SUCCESS, { data });
export const KMTContract = data => action(KMT_CONTRACT, { data });
export const DINRegistryContract = data =>
  action(DIN_REGISTRY_CONTRACT, { data });
export const OrderStoreContract = data => action(ORDER_STORE_CONTRACT, { data });
export const KMTBalance = data => action(KMT_BALANCE, { data });
export const ETHBalance = data => action(ETH_BALANCE, { data });
export const receivedAllProducts = data =>
  action(RECEIVED_ALL_PRODUCTS, { data });
export const receivedOwnerProducts = data =>
  action(RECEIVED_OWNER_PRODUCTS, { data });
export const receivedPurchases = data => action(RECEIVED_PURCHASES, { data });
export const receivedSales = data => action(RECEIVED_SALES, { data });

// Actions
export const selectedMenuItemId = data =>
  action(SELECTED_MENU_ITEM_ID, { data });

const getAccount = () => {
  return async (dispatch, getState) => {
    const accounts = await getAccountsAsync(getState().web3);
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

const getNetwork = () => {
  return async (dispatch, getState) => {
    const network = await getNetworkAsync(getState().web3);
    if (network) {
      dispatch(networkSuccess(network));
    } else {
      dispatch(networkHasError(true));
    }
  };
};

const getBalances = () => {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const KMTContract = getState().KMTContract;
    const account = getState().account;

    const KMT = await getKMTBalanceAsync(web3, KMTContract, account);
    dispatch(KMTBalance(KMT));

    const ETH = await getETHBalanceAsync(web3, account);
    dispatch(ETHBalance(ETH));
  };
};

const fetchProducts = filter => {
  return async (dispatch, getState) => {
    const DINRegistry = getState().DINRegistry;
    const web3 = getState().web3;

    if (DINRegistry !== null && web3 !== null) {
      let products;

      if (filter === "all") {
        products = await getAllProducts(DINRegistry, web3);
        dispatch(receivedAllProducts(products));
      } else if (filter === "owner") {
        products = await getOwnerProducts(DINRegistry, web3);
        dispatch(receivedOwnerProducts(products));
      }
    }
  };
};

const fetchOrders = type => {
  return async (dispatch, getState) => {
    console.log("WTF")

    const orderStore = getState().OrderStore;
    const web3 = getState().web3;
    const account = getState().account;

    console.log(orderStore);

    if (orderStore !== null && web3 !== null && account !== null) {
      if (type == "purhases") {
        const purchases = await getPurchases(orderStore, web3, account);
        dispatch(receivedPurchases(purchases));
      } else if (type == "sales") {
        const sales = await getSales(orderStore, web3, account);

        dispatch(receivedSales(sales));
      }
    }
  };
};

const getContracts = () => {
  return async (dispatch, getState) => {
    const web3 = getState().web3;

    const KMT = await getKioskMarketToken(web3);
    const DINRegistry = await getDINRegistry(web3);
    const OrderStore = await getOrderStore(web3);

    if (KMT !== null) {
      dispatch(KMTContract(KMT));

      // If there's an account, get the KMT balance
      if (getState().account !== null) {
        dispatch(getBalances());
      }
    }

    if (DINRegistry !== null) {
      dispatch(DINRegistryContract(DINRegistry));

      dispatch(fetchProducts("all"));
    }

    if (OrderStore !== null) {
      dispatch(OrderStoreContract(OrderStore));
    }

  };
};

// Fetch web3, contracts, account and dispatch to store
export const initKiosk = () => {
  return async dispatch => {
    dispatch(web3IsLoading(true));
    try {
      const results = await loadWeb3();
      const web3 = results.web3;

      dispatch(web3Success(web3));

      // Get account
      dispatch(getAccount());

      // Get network
      dispatch(getNetwork());

      // Get contracts
      dispatch(getContracts());
    } catch (err) {
      // Dispatch an error if web3 doesn't load correctly
      dispatch(web3HasError(true));
    }
  };
};

export const selectMenuItem = id => {
  return async dispatch => {
    dispatch(selectedMenuItemId(id));

    switch (id) {
      case 0: // Marketplace
        dispatch(fetchProducts("all"));
        break;
      case 1: // Purchases
        dispatch(fetchOrders("purchases"));
        break;
      case 2: // Products
        dispatch(fetchProducts("owner"));
        break;
      case 3: // Sales
        dispatch(fetchOrders("sales"));
        break;
      default:
        break;
    }
  };
};

// const ERROR = {
//   NOT_CONNECTED: 1,
//   CONTRACTS_NOT_DEPLOYED: 2,
//   NETWORK_NOT_SUPPORTED: 3,
//   LOCKED_ACCOUNT: 4
// };