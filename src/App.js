import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";

import NavigationBar from "./Components/NavigationBar";
import Home from "./Home";
import Market from "./Market";
import NewENSDomain from "./ENS/NewENSDomain";
import NewProduct from "./NewProduct";
import Products from "./Products";
import Orders from "./Orders";
import View from "./View";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: "",
      balance: ""
    };

  }

  componentWillMount() {
    getWeb3.then(results => {
      const web3 = results.web3;
      const balance = web3.eth.getBalance(web3.eth.coinbase);
      const formattedBalance = web3.fromWei(balance, 'ether').toNumber().toFixed(3) + " ETH";
      this.setState({ 
        account: web3.eth.coinbase,
        balance: formattedBalance
      })
    })
  }

  render() {
    return (
      <div>
        <div>
          <NavigationBar className="navigation-bar" account={this.state.account} balance={this.state.balance} />
        </div>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/orders" component={Orders} />
            <Route exact path="/products" component={Products} />
            <Route
              exact path="/products/new"
              render={props => <NewProduct {...props} />}
            />
            <Route
              exact path="/products/new/ens"
              render={props => <NewENSDomain {...props} />}
            />
            <Route path="/DIN/:din" component={View} />
            <Route path="/market/:marketAddr" component={Market} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

// https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957
