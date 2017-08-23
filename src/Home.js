import React, { Component } from "react";
import { getDINRegistry } from "./utils/contracts";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";
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
      selectedProduct: {}
    };

    this.handleSelectProduct = this.handleSelectProduct.bind(this);
  }

  componentWillMount() {
    // Get the global DIN registry
    getDINRegistry(this.props.web3).then(registry => {
      this.setState({ DINRegistry: registry }, () => {
        this.getProducts();
      });
    });
  }

  getProducts() {
    getAllDINs(this.state.DINRegistry).then(DINs => {
      let promises = DINs.map(DIN => {
        return infoFromDIN(DIN, this.props.web3, this.state.DINRegistry);
      });

      Promise.all(promises).then(results => {
        this.setState({ products: results });
      });
    });
  }

  handleSelectProduct(product) {
    this.setState({
      showBuyModal: true,
      selectedProduct: product
    });
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });

    return (
      <div className="home-container">
        <SideMenu className="side-menu" />
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