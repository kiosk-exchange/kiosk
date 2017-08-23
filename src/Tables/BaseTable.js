import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";

class BaseTable extends Component {
  render() {
    const tableRowStyle = { height: "70px" };
    const tableColumnStyle = { whiteSpace: "normal" };

    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            {this.props.headers.map(header => {
              return (
                <TableHeaderColumn key={header}>
                  {header}
                </TableHeaderColumn>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.props.rows}
        </TableBody>
      </Table>
    );
  }
}

export default BaseTable;