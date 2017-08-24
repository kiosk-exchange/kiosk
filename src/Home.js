import React, { Component } from "react";
import { getDINRegistry } from "./utils/contracts";
import { getAllProducts, getSellerProducts } from "./utils/getProducts";
import { getPurchases, getSales } from "./utils/getOrders";
import BuyModal from "./Components/BuyModal";
import SideMenu from "./Components/SideMenu";
import HeaderToolbar from "./Components/HeaderToolbar";
import MarketplaceTable from "./Tables/MarketplaceTable";
import PurchasesTable from "./Tables/PurchasesTable";
import SalesTable from "./Tables/SalesTable";
import Alert from "./Components/Alert";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DINRegistry: null,
      products: [],
      orders: [],
      selectedProduct: {},
      selectedListItem: "marketplace",
      showAlert: false
    };

    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.handleSelectListItem = this.handleSelectListItem.bind(this);
    this.handleBuyKMTClick = this.handleBuyKMTClick.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  componentWillMount() {
    // Get the global DIN registry
    getDINRegistry(this.props.web3).then(registry => {
      this.setState({ DINRegistry: registry }, () => {
        this.getAllProducts();
      });
    });
  }

  getAllProducts() {
    getAllProducts(this.state.DINRegistry, this.props.web3).then(products => {
      this.setState({ products: products });
    });
  }

  getSellerProducts() {
    getSellerProducts(
      this.state.DINRegistry,
      this.props.web3.eth.accounts[0],
      this.props.web3
    ).then(products => {
      this.setState({ products: products });
    });
  }

  getPurchases() {
    getPurchases(
      this.props.web3,
      this.props.web3.eth.accounts[0]
    ).then(orders => {
      this.setState({ orders: orders });
    });
  }

  getSales() {
    getSales(this.props.web3, this.props.web3.eth.accounts[0]).then(orders => {
      this.setState({ orders: orders });
    });
  }

  handleSelectProduct(product) {
    this.setState({
      showBuyModal: true,
      selectedProduct: product
    });
  }

  handleSelectListItem(item) {
    if (item !== this.state.selectedListItem) {
      // Remove all products
      this.setState({
        selectedListItem: item,
        products: [],
        orders: []
      });

      switch (item) {
        case "marketplace":
          this.getAllProducts();
          break;
        case "products":
          this.getSellerProducts();
          break;
        case "purchases":
          this.getPurchases();
          break;
        case "sales":
          this.getSales();
          break;
        default:
          break;
      }
    }
  }

  handleBuyKMTClick(event) {
    this.setState({ showAlert: true });
  }

  dismissAlert() {
    this.setState({ showAlert: false });
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });
    let table = null;

    switch (this.state.selectedListItem) {
      case "marketplace":
        table = (
          <MarketplaceTable
            products={this.state.products}
            handleBuy={this.handleSelectProduct}
          />
        );
        break;
      case "purchases":
        table = <PurchasesTable orders={this.state.orders} />;
        break;
      case "sales":
        table = <SalesTable orders={this.state.orders} />;
        break;
      default:
        console.log(this.state.selectedListItem);
        break;
    }

    return (
      <div className="home-container">
        <SideMenu
          className="side-menu"
          handleSelectListItem={this.handleSelectListItem}
          handleBuyKMTClick={this.handleBuyKMTClick}
        />
        <div className="header-toolbar">
          <HeaderToolbar web3={this.props.web3} />
        </div>
        <div className="new-table">
          {table}
        </div>
        <BuyModal
          show={this.state.showBuyModal}
          onHide={hideBuyModal}
          product={this.state.selectedProduct}
          web3={this.props.web3}
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