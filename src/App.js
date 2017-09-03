import React, { Component } from "react";
// import { Route } from "react-router-dom";
import SideMenu from "./components/SideMenu";
import NavBar from "./components/NavBar";
import TableContainer from "./tables/TableContainer";
import BuyModal from "./components/BuyModal";
import ErrorMessage from "./components/ErrorMessage";
import { connect } from "react-redux";
import { initKiosk } from "./redux/actions";
import { loadWeb3 } from "./utils/kioskWeb3";

const mapStateToProps = state => ({
  web3: state.config.web3,
  error: state.config.web3Error,
  isLoading: state.config.web3IsLoading
});

class App extends Component {
  // Initialize Kiosk (web3, accounts, contracts)
  componentDidMount() {
    const { dispatch } = this.props;
    loadWeb3.then(results => {
      dispatch(initKiosk(results.web3))
    })
  }

  render() {
    const { web3, isLoading, error } = this.props;

    const hContainerStyle = {
      display: "flex", // 💪
      flexFlow: "row",
      width: "100%",
      height: "100%"
    };

    const sideMenuStyle = {
      flex: "1",
      minWidth: "220px",
      maxWidth: "220px",
      height: "100vh"
    };

    const rightContainerStyle = {
      display: "flex",
      flex: "2",
      flexFlow: "column",
      height: "100%"
    };

    const tableStyle = {
      padding: "10px 30px"
    };

    let content = null;
    if (web3) {
      content = <TableContainer />   
    } else if (error && !isLoading) {
      content = <ErrorMessage title="You are not connected to an Ethereum node" />
    }

    return (
      <div style={hContainerStyle}>
        <div style={sideMenuStyle}>
          <SideMenu />
        </div>
        <div style={rightContainerStyle}>
          <div>
            <NavBar />
          </div>
          <div style={tableStyle}>
            {content}
          </div>
        </div>
        <BuyModal />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);

//

// <div style={{ padding: "10px 30px" }} />
// <TableContainer />

//   const ERROR = {
//   NOT_CONNECTED: 1,
//   CONTRACTS_NOT_DEPLOYED: 2,
//   NETWORK_NOT_SUPPORTED: 3,
//   LOCKED_ACCOUNT: 4
// };