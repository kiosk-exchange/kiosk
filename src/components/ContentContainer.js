import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Marketplace from "../pages/Marketplace";
import Purchases from "../pages/Purchases";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import Market from "../pages/Market";
import BuyModal from "./BuyModal";

class ContentContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: {},
      showModal: false
    };

    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleBuyModalClose = this.handleBuyModalClose.bind(this);
  }

  handleBuyClick(product) {
    this.setState({ selectedProduct: product });
    this.setState({ showModal: true });
  }

  handleBuyModalClose() {
    this.setState({ showModal: false });
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
            onHide={() => {}}
            product={this.state.selectedProduct}
            handleClose={this.handleBuyModalClose}
          />
        </div>
      );
    }
    return null;
  }
}

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