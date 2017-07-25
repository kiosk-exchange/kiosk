import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Orders from './Orders'
import Register from './Register'
import View from './View'


class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/orders' component={Orders}/>
          <Route path='/register' component={Register}/>
          <Route path='/view/:din' component={View}/>
        </Switch>
      </div>
    );
  }
}

export default App;
