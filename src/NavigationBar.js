import React, { Component } from 'react'
import { Grid,  Navbar, Nav, NavItem } from 'react-bootstrap';

class NavigationBar extends Component {

  render() {
    return (
      <Navbar>
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">kiosk</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav pullRight>
            <NavItem href="/orders">My Orders</NavItem>
          </Nav>
        </Grid>
      </Navbar>
    )
  }

}

export default NavigationBar;
