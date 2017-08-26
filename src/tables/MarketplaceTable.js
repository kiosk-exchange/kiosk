import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle, tableColumnStyle } from "./TableStyles";
import BaseTableContainer from "./BaseTableContainer";
import BuyColumn from "./BuyColumn";

class MarketplaceTable extends Component {
  render() {
    return (
      <BaseTableContainer
        title="All Products"
        headers={["DIN", "Name", "Price (KMT)", "Market", "Buy"]}
        rows={this.props.products.map(product => {
          return (
            <TableRow style={tableRowStyle} key={product.DIN}>
              <TableRowColumn>
                {product.DIN}
              </TableRowColumn>
              <TableRowColumn style={tableColumnStyle}>
                {product.name}
              </TableRowColumn>
              <TableRowColumn>
                {product.price}
              </TableRowColumn>
              <TableRowColumn>
                <Link style={{color: "#32C1FF"}} to={`/market/${product.market}`}>{product.market.slice(0,12)}</Link>
              </TableRowColumn>
              <BuyColumn product={product} handleBuy={() => this.props.handleBuyClick(product)} />
            </TableRow>
          );
        })}
      />
    );
  }
}

export default MarketplaceTable;