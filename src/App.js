import React, { Component } from "react";
const PropTypes = require("prop-types");
import { Switch, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import Marketplace from "./pages/Marketplace";
import Purchases from "./pages/Purchases";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null
    };
  }

  // TODO: Use Redux
  getChildContext() {
    return {
      web3: this.state.web3,
      DINRegistry: this.state.DINRegistry,
      kioskRed: "#FC575E",
      kioskGray: "#2C363F",
      kioskLightGray: "#6E7E85",
      kioskWhite: "#F6F8FF"
    };
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({ web3: results.web3 });
      // Get the global DIN registry
      getDINRegistry(results.web3).then(registry => {
        this.setState({ DINRegistry: registry });
      });
    });
  }

  getAccount() {
    const account = this.state.web3.eth.coinbase;
    this.setState({ account: account });
    this.state.web3.eth.getBalance(account, (error, result) => {
      const formattedBalance =
        this.state.web3.fromWei(result, "ether").toNumber().toFixed(3) + " ETH";
      this.setState({ balance: formattedBalance });
    });
  }

  render() {
    // Make sure there is always a web3 object available
    // Render vs. component: https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957}
    // <Route exact path="/" render={props => <Marketplace {...props}/>} />
    if (this.state.web3 && this.state.DINRegistry) {
      return (
        <MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={Marketplace} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/purchases" component={Purchases} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/sales" component={Sales} />
          </Switch>
        </MuiThemeProvider>
      );
    }
    // TODO: Otherwise, show an error message.
    return null;
  }
}

// Global Variables
App.childContextTypes = {
  web3: PropTypes.object,
  DINRegistry: PropTypes.object,
  kioskRed: PropTypes.string,
  kioskGray: PropTypes.string,
  kioskLightGray: PropTypes.string,
  kioskWhite: PropTypes.string
};

export default App;