import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ProductView from './Components/ProductView'

// Hardcoded to first registered product
var productID = 10000001;

class Home extends Component {

	constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

	handleClick(event) {
		this.props.history.push('/products')
	}

  render() {
    return (
    	<div className="welcome-header">
    		<h1>Welcome to Kiosk</h1>
    		<button onClick={this.handleClick}>
    			Get started
    		</button>
    	</div>
    );
  }
  
}

export default Home;
