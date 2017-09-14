import React, { Component } from "react";
import SideMenu from "./components/SideMenu";
import NavBar from "./components/NavBar";
import BuyModal from "./components/BuyModal";
import BuyKMTModal from "./components/BuyKMTModal";
import PendingTxSnackbar from "./components/PendingTxSnackbar";
import ErrorMessage from "./components/ErrorMessage";
import { connect } from "react-redux";
import { initKiosk } from "./redux/actions/config";
import { DATA_TYPE } from "./redux/actions/blockchain";

const mapStateToProps = state => {
  return {
    web3: state.config.web3,
    network: state.config.network,
    error: state.config.web3Error
  };
};

class App extends Component {
  // Initialize Kiosk (web3, accounts, contracts)
  componentDidMount() {
    const { dispatch, dataType } = this.props;
    if (dataType) {
      dispatch(initKiosk(dataType));
    } else {
      dispatch(initKiosk(DATA_TYPE.ALL_PRODUCTS));
    }
  }

  render() {
    const { web3, network, error, dataType } = this.props;

    const hContainerStyle = {
      display: "flex",
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
    if (web3 && network) {
      if (network.valid === true) {
        content = this.props.children;
      } else {
        content = (
          <ErrorMessage
            title="Kiosk is not deployed to this network. Please connect to Kovan Test Network"
            showIcon={false}
          />
        );
      }
    } else if (error === true) {
      content = (
        <ErrorMessage
          title="You are not connected to an Ethereum node"
          showIcon={true}
        />
      );
    }

    return (
      <div style={hContainerStyle}>
        <div style={sideMenuStyle}>
          <SideMenu value={dataType} />
        </div>
        <div style={rightContainerStyle}>
          <div>
            <NavBar />
          </div>
          <div style={tableStyle}>{content}</div>
        </div>
        <BuyModal />
        <BuyKMTModal />
        <PendingTxSnackbar />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
