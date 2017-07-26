import React, { Component } from 'react'
import SearchBar from './Components/SearchBar'

class Home extends Component {

  constructor(props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch(query) {
    var din = "/DIN/" + query
    this.props.history.push(din)
  }

  render() {
    return (
      <div>
      	<div className="welcome-header">
      		<h1>Welcome to Kiosk</h1>
      	</div>
        <div className="search-bar">
          <SearchBar action={this.handleSearch}/>
        </div>
      </div>
    );
  }

}

export default Home;
