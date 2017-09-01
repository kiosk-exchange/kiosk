// This will contain all actions related to web3 / kiosk
import {
  loadWeb3,
  getAccountsAsync,
  getNetworkAsync,
  getKMTBalanceAsync,
  getETHBalanceAsync
} from "../utils/kioskWeb3";
import { getKioskMarketToken } from "../utils/contracts";

export const WEB_3_LOADING = "WEB_3_LOADING";
export const WEB_3_ERROR = "WEB_3_ERROR";
export const WEB_3_SUCCESS = "WEB_3_SUCCESS";
export const ACCOUNT_ERROR = "ACCOUNT_ERROR";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";
export const NETWORK_ERROR = "NETWORK_ERROR";
export const NETWORK_SUCCESS = "NETWORK_SUCCESS";
export const KMT_CONTRACT = "KMT_CONTRACT";
export const KMT_BALANCE = "KMT_BALANCE";
export const ETH_BALANCE = "ETH_BALANCE";

// Helper function
const action = (type, value) => ({
  type: type,
  ...value
});

export const web3IsLoading = data => action(WEB_3_LOADING, { data });
export const web3HasError = data => action(WEB_3_ERROR, { data });
export const web3Success = data => action(WEB_3_SUCCESS, { data });
export const accountHasError = data => action(ACCOUNT_ERROR, { data });
export const accountSuccess = data => action(ACCOUNT_SUCCESS, { data });
export const networkHasError = data => action(NETWORK_ERROR, { data });
export const networkSuccess = data => action(NETWORK_SUCCESS, { data });
export const KMTContract = data => action(KMT_CONTRACT, { data });
export const KMTBalance = data => action(KMT_BALANCE, { data });
export const ETHBalance = data => action(ETH_BALANCE, { data });

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

const getContracts = () => {
  return async (dispatch, getState) => {
    const KMT = await getKioskMarketToken(getState().web3);
    if (KMT) {
      dispatch(KMTContract(KMT));

      // If there's an account, get the KMT balance
      if (getState().account !== null) {
        dispatch(getBalances());
      }
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

// const ERROR = {
//   NOT_CONNECTED: 1,
//   CONTRACTS_NOT_DEPLOYED: 2,
//   NETWORK_NOT_SUPPORTED: 3,
//   LOCKED_ACCOUNT: 4
// };