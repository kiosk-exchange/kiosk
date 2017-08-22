import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";
import NavigationBar from "./Components/NavigationBar";
import Home from "./Home";
import Landing from "./Pages/Landing";
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
      network: "",
      account: "",
      balance: ""
    };
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState(
        {
          web3: results.web3
        },
        () => {
          this.getNetwork();
          this.getAccount();
        }
      );
    });
  }

  getNetwork() {
    var network;
    this.state.web3.version.getNetwork((err, networkId) => {
      switch (networkId) {
        case "1":
          network = "Main Ethereum Network";
          break;
        case "2":
          network = "Morden Test Network";
          break;
        case "3":
          network = "Ropsten Test Network";
          break;
        case "42":
          network = "Kovan Test Network";
          break
        default:
          network = "Private Network";
          break;
      }
      this.setState({ network: network });
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
      <div>
        <div>
          <NavigationBar
            network={this.state.network}
            account={this.state.account}
            balance={this.state.balance}
            className="navigation-bar"
          />
        </div>
        <div className="App">
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
        </div>
      </div>
    );
  }
}

export default App;

// https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957