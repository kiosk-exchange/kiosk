import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class NavigationBar extends Component {

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Kiosk</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="/orders">Orders</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem href="/products">Products</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

}

export default NavigationBar;
