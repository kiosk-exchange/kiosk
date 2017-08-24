import React, { Component } from "react";
import BuyModal from "./components/BuyModal";
import SideMenu from "./components/SideMenu";
import HeaderToolbar from "./components/HeaderToolbar";
import Alert from "./components/Alert";

class Home extends Component {
  constructor(props) {
    super(props);

    console.log(this.props)

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
    this.setState({ showAlert: true });
  }

  dismissAlert() {
    this.setState({ showAlert: false });
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });

    return (
      <div className="home-container">
        <SideMenu 
          {...this.props}
          className="side-menu"
          handleSelectListItem={this.handleSelectListItem}
          handleBuyKMTClick={this.handleBuyKMTClick}
        />
        <div className="header-toolbar">
          <HeaderToolbar web3={this.context.web3} />
        </div>
        <div className="home-table">
          {this.props.children}
        </div>
        <BuyModal
          show={this.state.showBuyModal}
          onHide={hideBuyModal}
          product={this.state.selectedProduct}
        />
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

export default Home;