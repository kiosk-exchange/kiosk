import React, { Component } from "react";
import { Link } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { Table } from "react-bootstrap";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";
import BuyModal from "./Components/BuyModal";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      products: [],
      showBuyModal: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.showBuyModal = this.showBuyModal.bind(this);
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
      // Get product details (name, node, price) from the market
      var fullProducts = DINs.map(DIN => {
        return infoFromDIN(DIN, this.state.DINRegistry);
      });

      this.setState({ products: fullProducts });
    });
  }

  handleSearch(query) {
    var din = "/DIN/" + query;
    this.props.history.push(din);
  }

  handleBuy() {
    console.log("Buy");
  }

  showBuyModal() {
    console.log("Hello")
    this.setState({ showBuyModal: true })
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });

    return (
      <div>
        <div className="home-table">
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <th>DIN</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Market</th>
              </tr>
              {this.state.products.map((product, index) =>
                <tr key={index}>
                  <td>
                    <a href="#" onClick={this.showBuyModal}>{product.DIN}</a>
                    {
                      // <Link to={`/DIN/${product.DIN}`}>{product.DIN}</Link>
                    }
                  </td>
                  <td>
                    {product.name}
                  </td>
                  <td>
                    {product.owner}
                  </td>
                  <td>
                    <Link to={`/market/${product.market}`}>{product.market}</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <BuyModal show={this.state.showBuyModal} onHide={hideBuyModal} />
      </div>
    );
  }
}

export default Home;