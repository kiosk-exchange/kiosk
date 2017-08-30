import React, { Component } from "react";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle, tableColumnStyle } from "./TableStyles";
import BaseTableContainer from "./BaseTableContainer";
import BuyColumn from "./BuyColumn";

class MarketTable extends Component {
  render() {
    return (
      <BaseTableContainer
        title={this.props.title}
        headers={["DIN", "Name", "Price (KMT)", "Buy"]}
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
              <BuyColumn product={product} handleBuyClick={this.props.handleBuyClick} />
            </TableRow>
          );
        })}
      />
    );
  }
}

export default MarketTable;