import React, { Component } from 'react'
import SearchBar from './Components/SearchBar'

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
      <div>
      	<div className="welcome-header">
      		<h1>Welcome to Kiosk</h1>
      	</div>
        <SearchBar />
      </div>
    );
  }

}

export default Home;
