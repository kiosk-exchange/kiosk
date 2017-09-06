import {
  getAccountsAsync,
  getNetworkAsync,
  getKMTBalanceAsync,
  getETHBalanceAsync
} from "../../utils/kioskWeb3";
import {
  getKioskMarketToken,
  getBuyer,
  getDINRegistry,
  getOrderStore,
  getEtherMarket
} from "../../utils/contracts";
import { loadWeb3 } from "../../utils/kioskWeb3";
import { DATA_TYPE, fetchDataForMenuItem } from "./blockchain";
import { selectedDataType } from "./actions";

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

// Helper function
const action = (type, data) => ({
  type: type,
  ...data
});

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

const getContracts = dataType => {
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

      dispatch(fetchDataForMenuItem(dataType));
      dispatch(getBalances());
    } catch (err) {
      console.log("ERROR: GET CONTRACTS");
    }
  };
};

const refreshNetwork = dataType => {
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
        dispatch(selectedDataType(dataType))
        dispatch(getContracts(dataType));
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
export const initKiosk = dataType => {
  return async dispatch => {
    setInterval(() => dispatch(refreshNetwork(dataType)), 1000);
  };
};
