// This will contain all actions related to web3 / kiosk
import {
  loadWeb3,
  getAccountsAsync,
  getNetworkAsync
} from "../utils/kioskWeb3";
import { getKioskMarketToken } from "../utils/contracts";

export const WEB_3_LOADING = "WEB_3_LOADING";
export const WEB_3_ERROR = "WEB_3_ERROR";
export const WEB_3_SUCCESS = "WEB_3_SUCCESS";
export const ACCOUNT_ERROR = "ACCOUNT_ERROR";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";
export const NETWORK_ERROR = "NETWORK_ERROR";
export const NETWORK_SUCCESS = "NETWORK_SUCCESS";

export const web3IsLoading = bool => ({
  type: WEB_3_LOADING,
  bool
});

export const web3HasError = bool => ({
  type: WEB_3_ERROR,
  bool
});

export const web3Success = web3 => ({
  type: WEB_3_SUCCESS,
  web3
});

export const accountHasError = bool => ({
  type: ACCOUNT_ERROR,
  bool
});

export const accountSuccess = account => ({
  type: ACCOUNT_SUCCESS,
  account
});

export const networkHasError = bool => ({
  type: NETWORK_ERROR,
  bool
})

export const networkSuccess = network => ({
  type: NETWORK_SUCCESS,
  network
})

const getAccount = async (web3, dispatch) => {
  const accounts = await getAccountsAsync(web3);
  if (accounts.length > 0) {
    const account = accounts[0];
    dispatch(accountSuccess(account));
  } else {
    dispatch(accountHasError(true));
  }
};

const getNetwork = async (web3, dispatch) => {
  const network = await getNetworkAsync(web3);
  if (network !== null) {
    dispatch(networkSuccess(network));
  } else {
    dispatch(networkHasError(true));
  }
};

const getContracts = async (web3, dispatch) => {
  //
};

// Fetch web3, contracts, account and dispatch to store
export const initKiosk = () => {
  return dispatch => {
    dispatch(web3IsLoading(true));

    loadWeb3()
      .then(results => {
        const web3 = results.web3;

        // Dispatch web3
        dispatch(web3Success(web3));

        // Get accounts
        dispatch(getAccount(web3, dispatch));

        // Get network
        dispatch(getNetwork(web3, dispatch));

        // // Get contracts
        // dispatch(getContracts(results.web3, dispatch));
      })
      .catch(() => {
        // Dispatch an error if web3 doesn't load correctly
        dispatch(web3HasError(true));
      });
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
//   let KioskMarketTokenPromise = getKioskMarketToken(web3);
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

// export const getEtherBalance = (web3, account) =>
//   new Promise((resolve, reject) => {
//     web3.eth.getBalance(account, (err, result) => {
//       const balance = web3.fromWei(result, "ether").toNumber();
//       resolve(balance);
//     });
//   });

// export const getKMTBalance = (web3, account, KMT) =>
//   new Promise((resolve, reject) => {
//     KMT.balanceOf(account, (err, result) => {
//       const balance = web3.fromWei(result, "ether").toNumber();
//       resolve(balance);
//     });
//   });

// // TODO: Add listener https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes

// fetchNetwork() {
// TODO: Handle dropped connection

// }