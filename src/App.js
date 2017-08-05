import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import getWeb3 from './utils/getWeb3'
import { getDINRegistry, getDINRegistrar, getPublicMarket, getENS, getENSMarket, getENSProduct } from './utils/contracts'

import NavigationBar from './Components/NavigationBar'
import Home from './Home'
import Market from './Market'
import Products from './Products'
import NewProduct from './NewProduct'
import Orders from './Orders'
import View from './View'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      DINRegistry: null
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({ web3: results.web3 }, () => {
        this.getContracts()
      })
    })
  }

  getContracts() {
  }

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
                <Market {...props} name="ENS" addProduct="Add ENS Domain" web3={this.state.web3}/>
              )}
            />
            <Route path='/orders' component={Orders}/>
            <Route exact path='/products' component={Products}/>
            <Route exact path='/products/new' render={(props) => (
                <NewProduct {...props} web3={this.state.web3}/>
              )}
            />
            <Route path='/DIN/:din' component={View}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
