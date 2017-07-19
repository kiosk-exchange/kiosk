import React, { Component } from 'react'
import { Grid,  Navbar } from 'react-bootstrap';

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
        </Grid>
      </Navbar>
    )
  }

}

export default NavigationBar;
