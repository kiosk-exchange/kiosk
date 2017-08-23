import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getWeb3 from "./utils/getWeb3";
// import getNetwork from "./utils/network";
import Home from "./Home";
import Market from "./Market";
import Products from "./Products";
import Orders from "./Orders";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null
    };
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({ web3: results.web3 });
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
    if (this.state.web3) {
      return (
        <MuiThemeProvider>
          <Switch>
            <Route
              exact
              path="/"
              // https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957
              render={props => <Home {...props} web3={this.state.web3} />}
            />
            <Route
              exact
              path="/orders"
              render={props => <Orders {...props} web3={this.state.web3} />}
            />
            <Route
              exact
              path="/products"
              render={props => <Products {...props} web3={this.state.web3} />}
            />
            <Route
              path="/market/:market"
              render={props => <Market {...props} web3={this.state.web3} />}
            />
          </Switch>
        </MuiThemeProvider>
      );
    }
    // TODO: Otherwise, show an error message.
    return null;
  }

}

export default App;

