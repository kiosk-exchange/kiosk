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
// import EmptyState from "./pages/EmptyState";

const ERROR = {
  NOT_CONNECTED: 0,
  CONTRACTS_NOT_FOUND: 1,
  LOCKED_ACCOUNT: 2
};

function Content(props) {
  if (props.web3) {
    return (
      <Switch>
        <Route exact path="/" render={props => <Marketplace {...props} />} />
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
        <Route exact path="/sales" render={props => <Sales {...props} />} />
        <Route path="/market/:market" render={props => <Market {...props} />} />
      </Switch>
    );
  }
  return null;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      account: undefined,
      network: {},
      error: null,
      etherMarket: null,
      isMetaMaskLocked: false
    };
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
          if (!this.state.web3) {
            this.setState({ error: ERROR.NOT_CONNECTED });
          } else {
            const web3 = this.state.web3;

            // Fetch account and network and listen for changes
            this.getAccount();
            this.getNetwork();

            // Get the global DIN registry
            getDINRegistry(web3)
              .then(registry => {
                this.setState({ DINRegistry: registry });
              })
              .catch(err => {
                this.setState({ error: ERROR.CONTRACTS_NOT_FOUND });
              });

            // Get Ether market
            getEtherMarket(web3)
              .then(market => {
                this.setState({ etherMarket: market });
              })
              .catch(err => {
                this.setState({ error: ERROR.CONTRACTS_NOT_FOUND });
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
        } else if (
          this.isMetaMaskLocked() === true &&
          this.state.isMetaMaskLocked === false
        ) {
          this.setState({ isMetaMaskLocked: true });
        }
      });
    }, 1000);
  }

  getNetwork() {
    setInterval(() => {
      if (this.state.web3.version.network !== this.state.network.id) {
        const network = getNetwork(this.state.web3.version.network);

        console.log("********** ETHEREUM NETWORK: " + network.id);

        this.setState({ network: network });
      }
    }, 1000);
  }

  isMetaMaskLocked() {
    // If no account and provider is MetaMask, show locked prompt
    if (
      typeof this.state.account === "undefined" &&
      this.isMetaMask() === true
    ) {
      return true;
    }
    return false;
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
            <Home {...props}>
              <Content web3={this.state.web3} />
            </Home>}
        />
      </MuiThemeProvider>
    );
  }
}

// else if (this.state.error) {
//   switch (this.state.error) {
//     case ERROR.NOT_CONNECTED:
//       return (
//         <EmptyState title="You are not connected to an Ethereum node" />
//       );
//     case ERROR.CONTRACTS_NOT_FOUND:
//       return (
//         <EmptyState
//           title="Contracts are not deployed"
//           message="truffle migrate --reset"
//         />
//       );
//     case ERROR.LOCKED_ACCOUNT:
//       return <EmptyState title="Your account is locked" />;
//     default:
//       return null;
//   }
// }

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