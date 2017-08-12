import React, { Component } from "react";
import { Link } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry, getDINMarket } from "./utils/contracts";
import { Table } from "react-bootstrap";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";
import { buyProduct } from "./utils/buy";
import BuyModal from "./Components/BuyModal";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      DINMarket: null,
      products: [],
      showBuyModal: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.showBuyModal = this.showBuyModal.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({ web3: results.web3 }, () => {
        // Get the global DIN registry
        getDINRegistry(this.state.web3).then(registry => {
          this.setState({ DINRegistry: registry }, () => {
            // TODO: Delete
            getDINMarket(this.state.web3).then(market => {
              this.setState({ DINMarket: market }, () => {
                this.getProducts();
              });
            });
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
    const DIN = 1000000000;
    const buyer = this.state.web3.eth.accounts[0];

    buyProduct(DIN, 1, 0, buyer, this.state.DINMarket)
  }

  showBuyModal() {
    this.setState({ showBuyModal: true })
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });

    return (
      <div>
        <div className="home-table">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>DIN</th>
                <th>Product Name</th>
                <th>Owner</th>
                <th>Market</th>
              </tr>
              {this.state.products.map((product, index) =>
                <tr key={index}>
                  <td>
                    <a href="#" onClick={this.showBuyModal}>{product.DIN}</a>
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
        <BuyModal show={this.state.showBuyModal} onHide={hideBuyModal} handleBuy={this.handleBuy} />
      </div>
    );
  }
}

export default Home;