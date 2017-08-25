import React, { Component } from "react";
const PropTypes = require("prop-types");
import { Switch, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { getWeb3 } from "./utils/getWeb3";
import { getNetwork } from "./utils/network";
import { getDINRegistry, getEtherMarket } from "./utils/contracts";
import Home from "./Home";
import Marketplace from "./pages/Marketplace";
import Purchases from "./pages/Purchases";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Market from "./pages/Market";
import EmptyState from "./pages/EmptyState";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      account: undefined,
      network: {},
      etherMarket: null,
      isMetaMaskLocked: false
    };

    this.isMetaMaskLocked = this.isMetaMaskLocked.bind(this);
  }

  // TODO: Use Redux
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
    getWeb3.then(results => {
      this.setState(
        {
          web3: results.web3
        },
        () => {
          if (this.state.web3) {
            const web3 = this.state.web3;

            // Fetch account and network and listen for changes
            this.getAccount();
            this.getNetwork();

            // Get the global DIN registry
            getDINRegistry(web3).then(registry => {
              this.setState({ DINRegistry: registry });
            });

            // Get Ether market
            getEtherMarket(web3).then(market => {
              this.setState({ etherMarket: market });
            });
          }
        }
      );
    });
  }

  // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
  getAccount() {
    setInterval(() => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (accounts[0] !== this.state.account) {
          this.setState({ account: accounts[0] });
          this.setState({ isMetaMaskLocked: false });
        } else if (this.isMetaMaskLocked() === true && this.state.isMetaMaskLocked === false) {
          this.setState({ isMetaMaskLocked: true });
        }
      });
    }, 1000);
  }

  getNetwork() {
    setInterval(() => {
      if (this.state.web3.version.network !== this.state.network.id) {
        const network = getNetwork(this.state.web3.version.network);
        this.setState({ network: network });
      }
    }, 1000);
  }

  isMetaMaskLocked() {
    // If no account and provider is MetaMask, show locked prompt
    return (
      typeof this.state.account === "undefined" &&
      this.state.web3.currentProvider.constructor.name.match(/metamask/i)
    );
  }

  render() {
    // Make sure there is always a web3 object available
    // Render vs. component: https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957}
    if (
      this.state.web3 &&
      this.state.DINRegistry &&
      this.state.account &&
      this.state.network
    ) {
      return (
        <MuiThemeProvider>
          <Route
            render={props =>
              // Inject history into everything
              <Home {...props}>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={props => <Marketplace {...props} />}
                  />
                  <Route
                    exact
                    path="/marketplace"
                    render={props => <Marketplace {...props} />}
                  />
                  <Route
                    exact
                    path="/purchases"
                    render={props => <Purchases {...props} />}
                  />
                  <Route
                    exact
                    path="/products"
                    render={props => <Products {...props} />}
                  />
                  <Route
                    exact
                    path="/sales"
                    render={props => <Sales {...props} />}
                  />
                  <Route
                    path="/market/:market"
                    render={props => <Market {...props} />}
                  />
                </Switch>
              </Home>}
          />
        </MuiThemeProvider>
      );
    } else if (this.state.isMetaMaskLocked === true) {
      return <EmptyState title="You are not logged in to MetaMask" />;
    }
    // TODO: Otherwise, show an error message (download MetaMask).
    return null;
  }
}

// Global Variables
App.childContextTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  network: PropTypes.string,
  DINRegistry: PropTypes.object,
  etherMarket: PropTypes.object,
  theme: PropTypes.object
};

export default App;