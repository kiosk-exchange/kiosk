import React, { Component } from "react";
import { Link } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry, getDINMarket } from "./utils/contracts";
import { Table, Pagination } from "react-bootstrap";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";
import { buyProduct } from "./utils/buy";
import BuyModal from "./Components/BuyModal";
import KioskTable from "./Components/KioskTable";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      DINMarket: null,
      products: [],
      activePage: 1,
      showBuyModal: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.showBuyModal = this.showBuyModal.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
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

    buyProduct(DIN, 1, 0, buyer, this.state.DINMarket);
  }

  showBuyModal() {
    this.setState({ showBuyModal: true });
  }

  handlePageSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
  }

  render() {
    let hideBuyModal = () => this.setState({ showBuyModal: false });
    const tableHeaders = ["DIN", "Product Name", "Owner", "Market"];

    const pageLimit = 10;
    var pages = Math.ceil(this.state.products.length / pageLimit);

    var lower = (this.state.activePage - 1) * pageLimit;
    var upper = lower + pageLimit + 1;
    var products = this.state.products.slice(lower, upper);

    return (
      <div>
        <div className="home-table">
          <Table striped bordered hover>
            <tbody>
              <tr>
                {tableHeaders.map(header =>
                  <th>
                    {header}
                  </th>
                )}
              </tr>

              {products.map(product =>
                <tr key={product.DIN}>
                  <td>
                    <a href="#" onClick={this.showBuyModal}>
                      {product.DIN}
                    </a>
                  </td>
                  <td>
                    {product.name}
                  </td>
                  <td>
                    {product.owner}
                  </td>
                  <td>
                    <Link to={`/market/${product.market}`}>
                      {product.market}
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination
            prev="Previous"
            next="Next"
            ellipsis
            items={pages}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handlePageSelect}
          />
        </div>
        <BuyModal
          show={this.state.showBuyModal}
          onHide={hideBuyModal}
          handleBuy={this.handleBuy}
        />
      </div>
    );
  }
}

export default Home;