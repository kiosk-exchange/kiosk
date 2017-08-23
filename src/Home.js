import React, { Component } from "react";
import { getDINRegistry } from "./utils/contracts";
import { getAllProducts, getSellerProducts } from "./utils/getProducts";
import { getPurchases, getSales } from "./utils/getOrders";
import BuyModal from "./Components/BuyModal";
import SideMenu from "./Components/SideMenu";
import HeaderToolbar from "./Components/HeaderToolbar";
import MarketplaceTable from "./Tables/MarketplaceTable";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DINRegistry: null,
      products: [],
      selectedProduct: {},
      selectedListItem: "marketplace"
    };

    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.handleSelectListItem = this.handleSelectListItem.bind(this);
  }

  componentWillMount() {
    // Get the global DIN registry
    getDINRegistry(this.props.web3).then(registry => {
      this.setState({ DINRegistry: registry }, () => {
        this.getAllProducts();
      });
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
        products: []
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
          break;
        default:
          break;
      }
    }
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
    getPurchases(this.props.web3, this.props.web3.eth.accounts[0]).then(orders => {
      console.log(orders)
    });
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });

    return (
      <div className="home-container">
        <SideMenu
          className="side-menu"
          handleSelectListItem={this.handleSelectListItem}
        />
        <div className="header-toolbar">
          <HeaderToolbar web3={this.props.web3} />
        </div>
        <div className="new-table">
          <MarketplaceTable
            products={this.state.products}
            handleBuy={this.handleSelectProduct}
          />
        </div>
        <BuyModal
          show={this.state.showBuyModal}
          onHide={hideBuyModal}
          product={this.state.selectedProduct}
          web3={this.props.web3}
        />
      </div>
    );
  }
}

export default Home;