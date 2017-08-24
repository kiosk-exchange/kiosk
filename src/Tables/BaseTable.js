import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from "material-ui/Table";

class BaseTable extends Component {
  render() {
    const tableStyle = {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#E0E0E0"
    }

    return (
      <Table style={tableStyle} height="500px" selectable={false}>
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