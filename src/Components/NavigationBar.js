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
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight onSelect={this.handleSelect}>
            <NavDropdown
              eventKey="1"
              title="0x1fcbc4e622599d82cdbe39decaeff1ea4d4a6452"
              id="nav-dropdown"
            >
              <MenuItem href="/products">Products</MenuItem>
              <MenuItem href="/orders">Orders</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;

// <Nav pullRight>
//   <NavItem href="/orders">Orders</NavItem>
// </Nav>
// <Nav pullRight>
//   <NavItem href="/products">Products</NavItem>
// </Nav>