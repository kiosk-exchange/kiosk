import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { getPrice, getIsAvailable } from "../utils/getProducts";
import { buyProduct } from "../utils/buy";
import Marketplace from "../pages/Marketplace";
import Purchases from "../pages/Purchases";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import Market from "../pages/Market";
import BuyModal from "./BuyModal";
import EmptyState from "../pages/EmptyState";
import ErrorMessage from "../components/ErrorMessage";

const ERROR = {
  NOT_CONNECTED: 1,
  CONTRACTS_NOT_DEPLOYED: 2,
  NETWORK_NOT_SUPPORTED: 3,
  LOCKED_ACCOUNT: 4
};

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
      selectedQuantity: 1,
      totalPrice: null,
      showModal: false,
      insufficientFunds: false
    };

    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleBuyModalClose = this.handleBuyModalClose.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleBuySelectedProduct = this.handleBuySelectedProduct.bind(this);
  }

  updateProduct(product, totalPrice) {
    this.setState({ selectedProduct: product });
    this.setState({ totalPrice: totalPrice });

    if (totalPrice > this.context.KMTBalance) {
      this.setState({ insufficientFunds: true });
    } else {
      this.setState({ insufficientFunds: false });
    }
  }

  handleBuyClick(product) {
    this.updateProduct(product, product.price);
    this.setState({ showModal: true });
  }

  handleBuyModalClose() {
    this.setState({ showModal: false });
  }

  handleQuantityChange(quantity) {
    this.setState({ selectedQuantity: quantity });
    let product = this.state.selectedProduct;

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
      const totalPrice = results[0];
      const available = results[1];

      product.available = available;

      this.updateProduct(product, totalPrice);
    });
  }

  handleBuySelectedProduct() {
    const product = this.state.selectedProduct;

    // Buy the product! This will pop up MetaMask for Chrome users.
    buyProduct(
      this.context.Buyer,
      product.DIN,
      this.state.selectedQuantity,
      this.state.totalPrice * 10 ** 18, // Denominate in KMT wei
      this.context.account
    ).then(result => {
      console.log(result);

      // Reload all balances etc.
      console.log(this.props);
      this.props.handleReset();
    });

    // Dismiss the modal
    this.setState({ showModal: false });
  }

  render() {
    if (this.context.web3 && this.context.DINRegistry && !this.props.error) {
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
            totalPrice={this.state.totalPrice}
            handleClose={this.handleBuyModalClose}
            handleQuantityChange={this.handleQuantityChange}
            handleBuySelectedProduct={this.handleBuySelectedProduct}
            insufficientFunds={this.state.insufficientFunds}
          />
        </div>
      );
    } else if (this.props.error !== null) {
      switch (this.props.error) {
        case ERROR.NOT_CONNECTED:
          return (
            <ErrorMessage title="You are not connected to an Ethereum node" />
          );
        case ERROR.CONTRACTS_NOT_DEPLOYED:
          return null;
        // return (
        //   <EmptyState
        //     title="Contracts are not deployed"
        //     message="truffle migrate --reset"
        //   />
        // );
        case ERROR.NETWORK_NOT_SUPPORTED:
          return (
            <EmptyState
              title="Kiosk does not support this network yet. Please connect to Kovan Test Network."
              message=""
            />
          );
        case ERROR.LOCKED_ACCOUNT:
          return <EmptyState title="Your account is locked" />;
        default:
          return null;
      }
    }
    return null;
  }
}

ContentContainer.contextTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  KioskMarketToken: PropTypes.object,
  Buyer: PropTypes.object,
  DINRegistry: PropTypes.object,
  KMTBalance: PropTypes.number
};

export default ContentContainer;