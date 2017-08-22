import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";
// import BuyModal from "./Components/BuyModal";
// import KioskTable from "./Components/KioskTable";
import SideMenu from "./Components/SideMenu";
import NewTable from "./Components/NewTable";

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
      let promises = DINs.map(DIN => {
        return infoFromDIN(DIN, this.state.web3, this.state.DINRegistry);
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
    // let hideBuyModal = () => this.setState({ showBuyModal: false });

    return (
      <div>
        <SideMenu />
        <div className="new-table">
        <NewTable/>
        </div>
      </div>
    );
  }
}

export default Home;

        // <BuyModal
        //   show={this.state.showBuyModal}
        //   onHide={hideBuyModal}
        //   product={this.state.selectedProduct}
        //   web3={this.state.web3}
        // />

        // <div className="product-table-container">
        //   <KioskTable
        //     headers={["DIN", "Product Name", "Seller", "Market"]}
        //     products={this.state.products}
        //     handleSelectProduct={this.handleSelectProduct}
        //   />
        // </div>