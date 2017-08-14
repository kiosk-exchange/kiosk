import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";
import BuyModal from "./Components/BuyModal";
import KioskTable from "./Components/KioskTable";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      products: [],
      selectedProduct: {}
    };

    this.handleSelectProduct = this.handleSelectProduct.bind(this);
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({ web3: results.web3 }, () => {
        // Get the global DIN registry
        getDINRegistry(this.state.web3).then(registry => {
          this.setState({ DINRegistry: registry }, () => {
            this.getProducts();
          });
        });
      });
    });
  }

  getProducts() {
    getAllDINs(this.state.DINRegistry).then(DINs => {
      var fullProducts = DINs.map(DIN => {
        return infoFromDIN(DIN, this.state.web3, this.state.DINRegistry);
      });

      this.setState({ products: fullProducts });
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
      <div>
        <div className="home-table">
          <KioskTable
            headers={["DIN", "Product Name", "Owner", "Market"]}
            products={this.state.products}
            handleSelectProduct={this.handleSelectProduct}
            type="Home"
          />
        </div>
        <BuyModal
          show={this.state.showBuyModal}
          onHide={hideBuyModal}
          product={this.state.selectedProduct}
          web3={this.state.web3}
        />
      </div>
    );
  }
}

export default Home;
