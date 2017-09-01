import React, { Component } from "react";
const PropTypes = require("prop-types");
import { Route } from "react-router-dom";
import { getWeb3 } from "./utils/getWeb3";
import { getNetwork } from "./utils/network";
import {
  getBuyer,
  getDINRegistry,
  getEtherMarket,
  getKioskMarketToken
} from "./utils/contracts";
import { getEtherBalance, getKMTBalance } from "./utils/contracts";
import Home from "./Home";
import WrappedContentContainer from "./components/ContentContainer";
import { connect } from "react-redux";

const ERROR = {
  NOT_CONNECTED: 1,
  CONTRACTS_NOT_DEPLOYED: 2,
  NETWORK_NOT_SUPPORTED: 3,
  LOCKED_ACCOUNT: 4
};

const getWeb3 = web3 => ({
  type: GET_WEB_3,
  web3
});

class App extends Component {
  refreshWeb3() {
    getWeb3.then(results => {
      this.setState(
        {
          web3: results.web3
        },
        () => {
          if (!this.state.web3) {
            console.log("********** ERROR: NOT CONNECTED");
            this.setState({ error: ERROR.NOT_CONNECTED });
            this.setState({
              network: {
                name: "Not Connected",
                color: "#6E7E85"
              }
            });
          } else {
            this.fetchAccount();
            this.fetchNetwork();

            // Get contracts and handle errors
            if (
              this.isSupportedNetwork(this.state.web3.version.network) === true
            ) {
              this.getContracts(this.state.web3);
            }

            this.setState({ refresh: false });
          }
        }
      );
    });
  }

  getContracts(web3) {
    let DINRegistryPromise = getDINRegistry(web3);
    let EtherMarketPromise = getEtherMarket(web3);
    let KioskMarketTokenPromise = getKioskMarketToken(web3);
    let BuyerPromise = getBuyer(web3);

    Promise.all([
      DINRegistryPromise,
      EtherMarketPromise,
      KioskMarketTokenPromise,
      BuyerPromise
    ]).then(
      results => {
        this.setState({ DINRegistry: results[0] });
        this.setState({ etherMarket: results[1] });
        this.setState({ KioskMarketToken: results[2] });
        this.setState({ Buyer: results[3] });
      },
      error => {
        console.log("********** ERROR: CONTRACTS NOT DEPLOYED");
        this.setState({ error: ERROR.CONTRACTS_NOT_DEPLOYED });
      }
    );
  }

  getBalances() {
    getEtherBalance(this.state.web3, this.state.account).then(result => {
      this.setState({ ETHBalance: result });
    });

    getKMTBalance(this.state.web3, this.state.account).then(result => {
      this.setState({ KMTBalance: result });
    });
  }

  // TODO: Add listener https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
  fetchAccount() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      // If there's no accounts, you're not connected to a node
      if (!accounts) {
        this.setState({ error: ERROR.NOT_CONNECTED });
      } else if (!accounts[0] && !this.state.error) {
        // If there's an empty account array, you're connected to MetaMask but not logged in
        console.log("********** ERROR: LOCKED ACCOUNT");
        this.setState({ error: ERROR.LOCKED_ACCOUNT });
      } else if (
        accounts[0] !== this.state.account ||
        this.state.refresh === true
      ) {
        this.setState({ account: accounts[0] });

        // If there's a change, just refresh the entire web3 object
        this.getBalances();
      }
    });
  }

  fetchNetwork() {
    // TODO: Handle dropped connection
    if (this.state.web3.version.network !== this.state.network.id) {
      this.state.web3.version.getNetwork((error, result) => {
        const network = getNetwork(result);
        console.log("********** " + network.name.toUpperCase());
        this.setState({ network: network });

        // If it's a real network (not TestRPC), and not Kovan, log not supported error.
        if (parseInt(network.id, 10) < 100 && network.id !== "42") {
          this.setState({ error: ERROR.NETWORK_NOT_SUPPORTED });
        }
      });
    }
  }

  isSupportedNetwork(network) {
    // TestRPC or Kovan
    return parseInt(network, 10) > 100 || network === "42";
  }

  // Make sure there is always a web3 object available
  // Render vs. component: https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957}
  render() {
    return (
      <Route
        render={props =>
          <Home
            {...props}
            KMTBalance={this.state.KMTBalance}
            ETHBalance={this.state.ETHBalance}
          >
            <WrappedContentContainer
              {...props}
              error={this.state.error}
              handleReset={this.fullReset}
            />
          </Home>}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3,
    account: state.account,
    network: state.network,
    DINRegistry: state.DINRegistry,
    Buyer: state.Buyer,
    etherMarket: state.etherMarket,
    KioskMarketToken: state.KioskMarketToken,
    KMTBalance: state.KMTBalance,
    ETHBalance: state.ETHBalance,
    error: state.error,
    refresh: state.refresh
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onWeb3: dispatch()
  };
};

App = connect(mapStateToProps)(App);

export default App;