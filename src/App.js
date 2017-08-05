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
            <Route exact path='/' render={(props) => (
                // https://github.com/ReactTraining/react-router/issues/4627#issuecomment-284133957
                <Market {...props} name="ENS" addProduct="Add ENS Domain"/>
              )}
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
