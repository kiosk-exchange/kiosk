import React, { Component } from 'react'

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
