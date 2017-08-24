import React, { Component } from "react";
const PropTypes = require("prop-types");
import { Switch, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import Home from "./Home";
import Marketplace from "./pages/Marketplace";
import Purchases from "./pages/Purchases";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      account: null
    };
  }

  // TODO: Use Redux
  getChildContext() {
    return {
      web3: this.state.web3,
      DINRegistry: this.state.DINRegistry,
      account: this.state.account,
      kioskRed: "#FC575E",
      kioskGray: "#2C363F",
      kioskLightGray: "#6E7E85",
      kioskWhite: "#F6F8FF"
    };
  }

  componentWillMount() {
    getWeb3.then(results => {
      const web3 = results.web3;

      this.setState({ web3: web3 });
      // Get the global DIN registry
      getDINRegistry(web3).then(registry => {
        this.setState({ DINRegistry: registry });
      });

      web3.eth.getAccounts((error, accounts) => {
        this.setState({ account: accounts[0] })
      })

    });
  }

  render() {
    // Make sure there is always a web3 object available
    // Render vs. component: https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957}
    // <Route exact path="/" render={props => <Marketplace {...props}/>} />
    if (this.state.web3 && this.state.DINRegistry && this.state.account) {
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
                  <Route path="market/:market" />
                </Switch>
              </Home>}
          />
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
  account: PropTypes.string,
  DINRegistry: PropTypes.object,
  kioskRed: PropTypes.string,
  kioskGray: PropTypes.string,
  kioskLightGray: PropTypes.string,
  kioskWhite: PropTypes.string
};

export default App;