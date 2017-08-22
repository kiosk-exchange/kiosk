import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getWeb3 from "./utils/getWeb3";
// import getNetwork from "./utils/network";
import Home from "./Home";
import Market from "./Market";
import NewENSDomain from "./ENS/NewENSDomain";
import NewProduct from "./NewProduct";
import Products from "./Products";
import Orders from "./Orders";
import View from "./View";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
    };
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState(
        {
          web3: results.web3
        },
        () => {
          // getNetwork(this.state.web3);
          this.getAccount();
        }
      );
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
    return (
      <MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/orders" component={Orders} />
            <Route exact path="/products" component={Products} />
            <Route
              exact
              path="/products/new"
              render={props => <NewProduct {...props} />}
            />
            <Route
              exact
              path="/products/new/ens"
              render={props => <NewENSDomain {...props} />}
            />
            <Route path="/DIN/:din" component={View} />
            <Route path="/market/:market" component={Market} />
          </Switch>
      </MuiThemeProvider>
    );
  }
}

export default App;

// https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957