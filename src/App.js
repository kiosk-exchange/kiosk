import React, { Component } from "react";
const PropTypes = require("prop-types");
import { Switch, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { getWeb3 } from "./utils/getWeb3";
import { getNetwork } from "./utils/network";
import { getDINRegistry, getEtherMarket } from "./utils/contracts";
import Home from "./Home";
import EmptyState from "./pages/EmptyState";
import ErrorMessage from "./components/ErrorMessage";
import ContentContainer from "./components/ContentContainer";

const ERROR = {
  NOT_CONNECTED: 1,
  CONTRACTS_NOT_DEPLOYED: 2,
  NETWORK_NOT_SUPPORTED: 3,
  LOCKED_ACCOUNT: 4
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      account: undefined,
      network: {},
      DINRegistry: null,
      etherMarket: null,
      error: null
    };
  }

  getChildContext() {
    return {
      web3: this.state.web3,
      DINRegistry: this.state.DINRegistry,
      account: this.state.account,
      network: this.state.network,
      etherMarket: this.state.etherMarket,
      theme: {
        red: "#FC575E",
        blue: "#32C1FF",
        gray: "#2C363F",
        lightGray: "#6E7E85",
        white: "#F6F8FF"
      }
    };
  }

  componentWillMount() {
    this.refreshWeb3();
  }

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
            // Get account and network and listen for changes
            this.getAccount();
            this.getNetwork();

            // Get contracts and handle errors
            if (
              this.isSupportedNetwork(this.state.web3.version.network) === true
            ) {
              this.getContracts(this.state.web3);
            }
          }
        }
      );
    });
  }

  getContracts(web3) {
    let DINRegistryPromise = getDINRegistry(web3);
    let EtherMarketPromise = getEtherMarket(web3);

    Promise.all([DINRegistryPromise, EtherMarketPromise]).then(
      results => {
        this.setState({ DINRegistry: results[0] });
        this.setState({ etherMarket: results[1] });
      },
      error => {
        console.log("********** ERROR: CONTRACTS NOT DEPLOYED");
        this.setState({ error: ERROR.CONTRACTS_NOT_DEPLOYED });
      }
    );
  }

  // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
  getAccount() {
    var accountInterval = setInterval(fetch, 1000);
    var app = this;

    function fetch() {
      app.state.web3.eth.getAccounts((error, accounts) => {
        // If there's no accounts, you're not connected to a node
        if (!accounts) {
          app.setState({ error: ERROR.NOT_CONNECTED });
        } else if (!accounts[0] && !app.state.error) {
          // If there's an empty account array, you're connected to MetaMask but not logged in
          console.log("********** ERROR: LOCKED ACCOUNT");
          app.setState({ error: ERROR.LOCKED_ACCOUNT });
        } else if (accounts[0] !== app.state.account) {
          app.setState({ account: accounts[0] });

          // If there's a change, just refresh the entire web3 object
          clearInterval(accountInterval);
          app.refreshWeb3();
        }
      });
    }
  }

  getNetwork() {
    var networkInterval = setInterval(fetch, 1000);
    var app = this;

    function fetch() {
      // TODO: Handle dropped connection
      if (app.state.web3.version.network !== app.state.network.id) {
        const network = getNetwork(app.state.web3.version.network);
        console.log("********** " + network.name.toUpperCase());
        app.setState({ network: network });

        // If it's a real network (not TestRPC), and not Kovan, log not supported error.
        if (parseInt(network.id, 10) < 100 && network.id !== "42") {
          app.setState({ error: ERROR.NETWORK_NOT_SUPPORTED });
        } else {
          // If there's a change, just refresh the entire web3 object
          clearInterval(networkInterval);
          app.refreshWeb3();
        }
      }
    }
  }

  isSupportedNetwork(network) {
    // TestRPC or Kovan
    return parseInt(network, 10) > 100 || network === "42";
  }

  isMetaMask() {
    if (this.state.web3.currentProvider.constructor.name.match(/metamask/i)) {
      return true;
    }
    return false;
  }

  // Make sure there is always a web3 object available
  // Render vs. component: https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957}
  render() {
    return (
      <MuiThemeProvider>
        <Route
          render={props =>
            <Home {...props} isError={this.state.error !== null}>
              <ContentContainer
                web3={this.state.web3}
                registry={this.state.DINRegistry}
                error={this.state.error}
              />
            </Home>
          }
        />
      </MuiThemeProvider>
    )
  }
}

// Global Variables
App.childContextTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  network: PropTypes.object,
  DINRegistry: PropTypes.object,
  etherMarket: PropTypes.object,
  theme: PropTypes.object
};

export default App;