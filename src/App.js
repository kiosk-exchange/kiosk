import React, { Component } from "react";
// import { Route } from "react-router-dom";
// import Home from "./Home";

// Redux
import { connect } from "react-redux";
import { initKiosk } from "./actions/kiosk";

const mapStateToProps = state => ({
  web3: state.web3,
  web3HasError: state.web3HasError,
  web3IsLoading: state.web3IsLoading
  // account: state.account,
  // network: state.network,
  // DINRegistry: state.DINRegistry,
  // Buyer: state.Buyer,
  // etherMarket: state.etherMarket,
  // KioskMarketToken: state.KioskMarketToken,
  // KMTBalance: state.KMTBalance,
  // ETHBalance: state.ETHBalance,
  // error: state.error,
  // refresh: state.refresh
});

const ERROR = {
  NOT_CONNECTED: 1,
  CONTRACTS_NOT_DEPLOYED: 2,
  NETWORK_NOT_SUPPORTED: 3,
  LOCKED_ACCOUNT: 4
};

class App extends Component {

  // Initialize Kiosk (web3, accounts, contracts)
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(initKiosk())
  }

  // TestRPC or Kovan
  isSupportedNetwork(network) {
    return parseInt(network, 10) > 100 || network === "42";
  }

  render() {
    const { web3, isLoading } = this.props;
    if (this.web3) {

    } else {

    }
    // SideMenu
    // NavBar
    // Table
    // Buy Modal
    // Network Error
  }
}

export default connect(mapStateToProps)(App);

// <Route
//   render={props =>
//     <Home
//       {...props}
//       KMTBalance={this.state.KMTBalance}
//       ETHBalance={this.state.ETHBalance}
//     >
//       <WrappedContentContainer
//         {...props}
//         error={this.state.error}
//         handleReset={this.fullReset}
//       />
//     </Home>}
// />