import React, { Component } from "react";
import PropTypes from "prop-types";
import BuyModal from "./components/BuyModal";
import SideMenu from "./components/SideMenu";
import HeaderToolbar from "./components/HeaderToolbar";
import Alert from "./components/Alert";
import { buyKMT } from "./utils/buy";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: {},
      selectedListItem: "marketplace",
      showAlert: false
    };

    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.handleBuyKMTClick = this.handleBuyKMTClick.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  handleSelectProduct(product) {
    this.setState({
      showBuyModal: true,
      selectedProduct: product
    });
  }

  handleBuyKMTClick(event) {
    // Buy one ether worth of KMT
    const value = this.context.web3.toWei(1, "ether");
    buyKMT(this.context.etherMarket, value, this.context.account);
  }

  dismissAlert() {
    this.setState({ showAlert: false });
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });

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
          <div style={{ flex: "3" }}>
            <HeaderToolbar handleBuyKMTClick={this.handleBuyKMTClick} />
          </div>
          <div style={{ flex: "4", padding: "10px 30px" }}>
            {this.props.children}
          </div>
          <BuyModal
            show={this.state.showBuyModal}
            onHide={hideBuyModal}
            product={this.state.selectedProduct}
          />
        </div>
        <Alert
          open={this.state.showAlert}
          title={"Coming Soon"}
          message={"Coming Soon"}
          handleClose={this.dismissAlert}
        />
      </div>
    );
  }
}

Home.contextTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  DINRegistry: PropTypes.object,
  etherMarket: PropTypes.object
};

export default Home;