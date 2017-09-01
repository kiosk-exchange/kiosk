// This will contain all actions related to web3 / kiosk
import { loadWeb3 } from "../utils/loadWeb3";

export const WEB_3_LOADING = "WEB_3_LOADING";
export const WEB_3_ERROR = "WEB_3_ERROR";
export const WEB_3_SUCCESS = "WEB_3_SUCCESS";
export const ACCOUNT_ERROR = "ACCOUNT_ERROR";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";

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

const getAccount = (web3, dispatch) => {
  return dispatch => {
    console.log("1")
    web3.eth.getAccounts((err, accounts) => {
      console.log("WORK");
      if (!err && accounts.length > 0) {
        const account = accounts[0];
        dispatch(accountSuccess(account));
        // Get balance
      } else {
        dispatch(accountHasError(true));
      }
    })
  };
};

// Fetch web3, contracts, account and dispatch to state
export const initKiosk = () => {
  return dispatch => {
    dispatch(web3IsLoading(true));
    loadWeb3()
      .then(web3 => {
        // Dispatch web3
        dispatch(web3Success(web3));

        // Get accounts
        dispatch(getAccount(web3, dispatch));

        // Get contracts
      })
      .catch(() => {
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

// getBalances() {
//   getEtherBalance(this.state.web3, this.state.account).then(result => {
//     this.setState({ ETHBalance: result });
//   });

//   getKMTBalance(this.state.web3, this.state.account).then(result => {
//     this.setState({ KMTBalance: result });
//   });
// }

// // TODO: Add listener https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes

// fetchNetwork() {
//   // TODO: Handle dropped connection
//   if (this.state.web3.version.network !== this.state.network.id) {
//     this.state.web3.version.getNetwork((error, result) => {
//       const network = getNetwork(result);
//       console.log("********** " + network.name.toUpperCase());
//       this.setState({ network: network });

//       // If it's a real network (not TestRPC), and not Kovan, log not supported error.
//       if (parseInt(network.id, 10) < 100 && network.id !== "42") {
//         this.setState({ error: ERROR.NETWORK_NOT_SUPPORTED });
//       }
//     });
//   }
// }