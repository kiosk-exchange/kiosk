import React from "react";
import { Link } from "react-router-dom";
import { TableRow, TableRowColumn } from "material-ui/Table";
import { tableRowStyle, tableColumnStyle } from "./TableStyles";
import BaseTableContainer from "./BaseTableContainer";
import BuyColumn from "./BuyColumn";

const MarketplaceTable = ({ products, onBuyClick }) => {
  return (
    <BaseTableContainer
      title="All Products"
      headers={["DIN", "Name", "Price (KMT)", "Market", "Buy"]}
      rows={products.map(product => {
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
              <Link
                style={{ color: "#32C1FF", textDecoration: "none" }}
                to={`/market/${product.market}`}
              >
                {product.market.slice(0, 12)}
              </Link>
            </TableRowColumn>
            <BuyColumn product={product} handleBuyClick={onBuyClick} />
          </TableRow>
        );
      })}
    />
  );
};

export default MarketplaceTable;