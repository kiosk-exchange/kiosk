import React, { Component } from "react";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";

class NavigationBar extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" className="kiosk-logo">
              kiosk
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight onSelect={this.handleSelect}>
            <NavDropdown
              eventKey="1"
              title={this.props.account.slice(0, 12)}
              id="nav-dropdown"
            >
              <MenuItem href="/products">My Products</MenuItem>
              <MenuItem href="/orders">My Orders</MenuItem>
            </NavDropdown>
            <NavItem>
              {this.props.network}
            </NavItem>
            <NavItem>
              {this.props.balance}
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;