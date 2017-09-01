import React, { Component } from "react";
// import { Route } from "react-router-dom";
import SideMenu from "./components/SideMenu";
// import HeaderToolbar from "./components/HeaderToolbar";
// import TableContainer from "./components/TableContainer";
// import BuyModal from "./components/BuyModal";

// Redux
import { connect } from "react-redux";
import { initKiosk } from "./actions/kiosk";

const mapStateToProps = state => ({
  web3: state.web3,
  hasError: state.web3HasError,
  isLoading: state.web3IsLoading
});

class App extends Component {
  // Initialize Kiosk (web3, accounts, contracts)
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(initKiosk());
  }

  // TestRPC or Kovan
  isSupportedNetwork(network) {
    return parseInt(network, 10) > 100 || network === "42";
  }

  render() {
    const { web3, isLoading } = this.props;

    const hContainerStyle = {
      display: "flex", // 💪
      flexFlow: "row",
      width: "100%",
      height: "100%"
    };

    const sideMenuStyle = {
      minWidth: "220px",
      maxWidth: "220px",
      height: "100vh"
    };

    const rightContainerStyle = {
      display: "flex",
      flexFlow: "column",
      height: "100%"
    };

    if (web3) {
      return (
        <div style={hContainerStyle}>
          <div style={sideMenuStyle}>
            <SideMenu />
          </div>
        </div>
      );
    } else {
      // Loading & Handle Error
      return <div />
    }
  }
}

export default connect(mapStateToProps)(App);

// <div style={rightContainerStyle}>
//   <div>
//     <HeaderToolbar />
//   </div>
//   <div style={{ padding: "10px 30px" }}>
//     <TableContainer />
//     <BuyModal />
//   </div>
// </div>;

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

//   const ERROR = {
//   NOT_CONNECTED: 1,
//   CONTRACTS_NOT_DEPLOYED: 2,
//   NETWORK_NOT_SUPPORTED: 3,
//   LOCKED_ACCOUNT: 4
// };