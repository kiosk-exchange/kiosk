import React, { Component } from "react";
import PropTypes from "prop-types";
import SideMenu from "./components/SideMenu";
import HeaderToolbar from "./components/HeaderToolbar";
import { buyKMT } from "./utils/buy";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: {},
      selectedListItem: "marketplace",
      showAlert: false
    };

    this.handleBuyKMTClick = this.handleBuyKMTClick.bind(this);
  }

  handleBuyKMTClick() {
    // Buy one ether worth of KMT
    const value = this.context.web3.toWei(1, "ether");
    buyKMT(this.context.etherMarket, value, this.context.account);
  }

  render() {
    const hContainerStyle = {
      display: "flex", // 💪
      flexFlow: "row",
      width: "100%",
      height: "100%",
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

    return (
      <div style={hContainerStyle}>
        <div style={sideMenuStyle}>
          <SideMenu
            {...this.props}
            className="side-menu"
            handleSelectListItem={this.handleSelectListItem}
          />
        </div>
        <div style={rightContainerStyle}>
          <div>
            <HeaderToolbar {...this.props} handleBuyKMTClick={this.handleBuyKMTClick} />
          </div>
          <div style={{ padding: "10px 30px" }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  DINRegistry: PropTypes.object,
  etherMarket: PropTypes.object,
  KioskMarketToken: PropTypes.object,
};

export default Home;