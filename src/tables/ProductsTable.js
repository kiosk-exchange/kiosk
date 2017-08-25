import React, { Component } from "react";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle, tableColumnStyle } from "./TableStyles";
import BaseTableContainer from "./BaseTableContainer";

class ProductsTable extends Component {
  render() {
    const accessors = ["DIN", "name", "price", "market"];

    return (
      <BaseTableContainer
        title={this.props.title}
        headers={["DIN", "Name", "Price (KMT)", "Market"]}
        rows={this.props.products.map(product => {
          return (
            <TableRow style={tableRowStyle} key={product.DIN}>
              {accessors.map(accessor => {
                return (
                  <TableRowColumn key={accessor} style={tableColumnStyle}>
                    {product[accessor]}
                  </TableRowColumn>
                )
              })}
            </TableRow>
          );
        })}
      />
    );
  }
}

export default ProductsTable;