import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { getPrice, getIsAvailable } from "../utils/getProducts";
import Marketplace from "../pages/Marketplace";
import Purchases from "../pages/Purchases";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import Market from "../pages/Market";
import BuyModal from "./BuyModal";

class ContentContainer extends Component {
  constructor(props) {
    super(props);

    /*
      ===== PRODUCT =====
      {
        DIN: string,
        name: string,
        owner: string,
        market: string,
        price: string,
        available: bool
      }
    */

    this.state = {
      selectedProduct: {},
      showModal: false
    };

    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleBuyModalClose = this.handleBuyModalClose.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  handleBuyClick(product) {
    this.setState({ selectedProduct: product });
    this.setState({ showModal: true });
  }

  handleBuyModalClose() {
    this.setState({ showModal: false });
  }

  handleQuantityChange(quantity) {
    var product = this.state.selectedProduct;

    // Update price and availability based on quantity selection
    const pricePromise = getPrice(
      this.context.web3,
      product.DIN,
      quantity,
      product.market
    );

    const availablePromise = getIsAvailable(
      this.context.web3,
      product.DIN,
      quantity,
      product.market
    );

    Promise.all([pricePromise, availablePromise]).then(results => {
      const price = results[0];
      const available = results[1];

      product.price = price;
      product.available = available;

      this.setState({ selectedProduct: product });
    });
  }

  render() {
    if (this.props.web3 && this.props.registry && !this.props.error) {
      return (
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                <Marketplace
                  {...this.props}
                  handleBuyClick={this.handleBuyClick}
                />}
            />
            <Route
              exact
              path="/marketplace"
              render={props =>
                <Marketplace
                  {...this.props}
                  handleBuyClick={this.handleBuyClick}
                />}
            />
            <Route
              exact
              path="/purchases"
              render={props => <Purchases {...this.props} />}
            />
            <Route
              exact
              path="/products"
              render={props => <Products {...this.props} />}
            />
            <Route
              exact
              path="/sales"
              render={props => <Sales {...this.props} />}
            />
            <Route
              path="/market/:market"
              render={props => <Market {...this.props} />}
            />
          </Switch>
          <BuyModal
            open={this.state.showModal}
            product={this.state.selectedProduct}
            handleClose={this.handleBuyModalClose}
            handleQuantityChange={this.handleQuantityChange}
          />
        </div>
      );
    }
    return null;
  }
}

ContentContainer.contextTypes = {
  web3: PropTypes.object,
  KioskMarketToken: PropTypes.object
};

// function Error(props) {
//   switch (props.error) {
//     case ERROR.NOT_CONNECTED:
//       return <ErrorMessage title="You are not connected to an Ethereum node" />;
//     case ERROR.CONTRACTS_NOT_DEPLOYED:
//       return (
//         <EmptyState
//           title="Contracts are not deployed"
//           message="truffle migrate --reset"
//         />
//       );
//     case ERROR.NETWORK_NOT_SUPPORTED:
//       return (
//         <EmptyState
//           title="Kiosk does not support this network yet. Please connect to Kovan Test Network."
//           message=""
//         />
//       );
//     case ERROR.LOCKED_ACCOUNT:
//       return <EmptyState title="Your account is locked" />;
//     default:
//       return null;
//   }
// }

export default ContentContainer;