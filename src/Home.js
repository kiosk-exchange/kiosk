import React, { Component } from 'react'

import NavigationBar from './Components/NavigationBar'
import ProductView from './Components/ProductView'

// Hardcoded to first registered product
var productID = 10000001;

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div>
          <NavigationBar className="navigation-bar" />
        </div>
        <ProductView din={productID}/>
      </div>
    );
  }
}

export default Home;
