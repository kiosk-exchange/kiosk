import React, { Component } from 'react'
import { Grid,  Navbar, Nav, NavItem } from 'react-bootstrap';

class NavigationBar extends Component {

  render() {
    return (
      <Navbar>
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Kiosk</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav>
            <NavItem href="/register">Register</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem href="/orders">My Orders</NavItem>
          </Nav>
        </Grid>
      </Navbar>
    )
  }

}

export default NavigationBar;
