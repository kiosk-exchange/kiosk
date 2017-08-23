import React, { Component } from "react";
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";

class MarketplaceTable extends Component {
  render() {
    const tableRowStyle = { "height": "70px" }
    const tableColumnStyle = { "whiteSpace": "normal" }

    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>DIN</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Market</TableHeaderColumn>
            <TableHeaderColumn>Buy</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.props.products.map(product => {
              return (
                <TableRow style={tableRowStyle} key={product.DIN}>
                  <TableRowColumn>{product.DIN}</TableRowColumn>
                  <TableRowColumn style={tableColumnStyle}>{product.name}</TableRowColumn>
                  <TableRowColumn>{product.market}</TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton label="Buy" backgroundColor="#32C1FF" labelColor="#FFFFFF" onClick={() => this.props.handleBuy(product)} />
                  </TableRowColumn>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    );
  }
}

export default MarketplaceTable;