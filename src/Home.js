import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import { getDINRegistry } from "./utils/contracts";
import { Table } from "react-bootstrap";
import SearchBar from "./Components/SearchBar";
import { getAllDINs, infoFromDIN } from "./utils/getProducts";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      DINRegistry: null,
      products: []
    };

    this.handleSearch = this.handleSearch.bind(this);
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

  render() {
    return (
      <div>
        <div className="search-bar">
          <SearchBar action={this.handleSearch} />
        </div>
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
                    {product.DIN}
                  </td>
                  <td>
                    {product.name}
                  </td>
                  <td>
                    {product.owner}
                  </td>
                  <td>
                    <a>{product.market}</a>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Home;