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
export const ACCOUNT_BALANCES = "ACCOUNT_BALANCES";
export const NETWORK_ERROR = "NETWORK_ERROR";
export const NETWORK_SUCCESS = "NETWORK_SUCCESS";
export const KMT_CONTRACT = "KMT_CONTRACT";

// Helper function
const action = (type, value) => ({
  type: type,
  ...value
});

export const web3IsLoading = bool => action(WEB_3_LOADING, { bool });
export const web3HasError = bool => action(WEB_3_ERROR, { bool });
export const web3Success = web3 => action(WEB_3_SUCCESS, { web3 });
export const accountHasError = bool => action(ACCOUNT_ERROR, { bool });
export const accountSuccess = account => action(ACCOUNT_SUCCESS, { account });
export const networkHasError = bool => action(NETWORK_ERROR, { bool });
export const networkSuccess = network => action(NETWORK_SUCCESS, { network });
export const KMTContract = contract => action(KMT_CONTRACT, { contract });
export const accountBalances = balances =>
  action(ACCOUNT_BALANCES, { balances });

const getAccount = web3 => {
  return async dispatch => {
    const accounts = await getAccountsAsync(web3);
    if (accounts.length > 0) {
      const account = accounts[0];
      dispatch(accountSuccess(account));
    } else {
      dispatch(accountHasError(true));
    }
  };
};

const getNetwork = web3 => {
  return async dispatch => {
    const network = await getNetworkAsync(web3);
    if (network) {
      dispatch(networkSuccess(network));
    } else {
      dispatch(networkHasError(true));
    }
  };
};

const getContracts = web3 => {
  return async dispatch => {
    const KMT = await getKioskMarketToken(web3);
    if (KMT) {
      dispatch(KMTContract(KMT));
    }
  };
};

// const getBalances = async (KMT, account, web3, dispatch) => {
//   const KMTBalance = await getKMTBalanceAsync(web3, KMT, account);
//   const ETHBalance = await getETHBalanceAsync(web3, account);

//   if (KMTBalance !== null && ETHBalance !== null) {
//     dispatch(
//       accountBalances({
//         balances: {
//           KMT: KMTBalance,
//           ETH: ETHBalance
//         }
//       })
//     );
//   }
// };

// Fetch web3, contracts, account and dispatch to store
export const initKiosk = () => {
  return async dispatch => {
    dispatch(web3IsLoading(true));
    try {
      const results = await loadWeb3();
      const web3 = results.web3;
      dispatch(web3Success(web3));

      // Get account
      dispatch(getAccount(web3));

      // Get network
      dispatch(getNetwork(web3));

      // Get contracts
      dispatch(getContracts(web3));
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

// getContracts(web3) {
//   let DINRegistryPromise = getDINRegistry(web3);
//   let EtherMarketPromise = getEtherMarket(web3);
//   let BuyerPromise = getBuyer(web3);

//   Promise.all([
//     DINRegistryPromise,
//     EtherMarketPromise,
//     KioskMarketTokenPromise,
//     BuyerPromise
//   ]).then(
//     results => {
//       this.setState({ DINRegistry: results[0] });
//       this.setState({ etherMarket: results[1] });
//       this.setState({ KioskMarketToken: results[2] });
//       this.setState({ Buyer: results[3] });
//     },
//     error => {
//       console.log("********** ERROR: CONTRACTS NOT DEPLOYED");
//       this.setState({ error: ERROR.CONTRACTS_NOT_DEPLOYED });
//     }
//   );
// }