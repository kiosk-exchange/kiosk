import React, { Component } from 'react'
import SearchBar from './Components/SearchBar'

class Home extends Component {

  render() {
    return (
      <div>
      	<div className="welcome-header">
      		<h1>Welcome to Kiosk</h1>
      	</div>
        <div className="search-bar">
          <SearchBar />
        </div>
      </div>
    );
  }

}

export default Home;
