import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Orders from './Orders'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/orders' component={Orders}/>
        </Switch>
      </div>
    );
  }
}

export default App;
