import React, { Component } from 'react'

import NavigationBar from './Components/NavigationBar'
import ProductView from './Components/ProductView'

class View extends Component {

  render() {
    console.log(this.props.match.din)
    return (
      <div>
        <ProductView din={parseInt(this.props.match.params.din, 10)}/>
      </div>
    );
  }
}

export default View;
