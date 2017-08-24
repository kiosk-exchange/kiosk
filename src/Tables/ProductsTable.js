import React, { Component } from "react";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle, tableColumnStyle } from "./TableStyles"
import BaseTable from "./BaseTable";

class ProductsTable extends Component {
  render() {
    return (
      <BaseTable
        headers={["DIN", "Name", "Price", "Market"]}
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
                {product.market}
              </TableRowColumn>
            </TableRow>
          );
        })}
      />
    );
  }
}

export default ProductsTable;