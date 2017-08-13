import React, { Component } from "react";
import { Table, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

class KioskTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      showBuyModal: false
    };

    this.handlePageSelect = this.handlePageSelect.bind(this);
  }

  handlePageSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
  }

  render() {
    const pageLimit = 10;
    var pages = Math.ceil(this.props.products.length / pageLimit);

    var lower = (this.state.activePage - 1) * pageLimit;
    var upper = lower + pageLimit + 1;
    var products = this.props.products.slice(lower, upper);

    return (
      <div>
        <Table striped bordered hover>
          <tbody>
            <tr>
              {this.props.headers.map(header =>
                <th key={header}>
                  {header}
                </th>
              )}
            </tr>
            {products.map(product =>
              <tr key={product.DIN}>
                <td>
                  <a href="#" onClick={() => this.props.handleSelectProduct(product)}>
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
    );
  }
}

export default KioskTable;