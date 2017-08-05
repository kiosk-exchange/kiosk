import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import NavigationBar from './Components/NavigationBar'
import Home from './Home'
import Market from './Market'
import Products from './Products'
import NewProduct from './NewProduct'
import Orders from './Orders'
import View from './View'

class App extends Component {

  render() {
    return (
      <div>
        <div>
          <NavigationBar className="navigation-bar" />
        </div>

        <div className="App">
          <Switch>
            <Route exact path='/' 
              render={
                // Pass props in render function
                // https://github.com/ReactTraining/react-router/issues/4105#issuecomment-291834881
                () => <Market name="ENS"/>
              }
            />
            <Route path='/orders' component={Orders}/>
            <Route exact path='/products' component={Products}/>
            <Route exact path='/products/new' component={NewProduct}/>
            <Route path='/DIN/:din' component={View}/>
          </Switch>
        </div>

      </div>
    );
  }
}

export default App;
