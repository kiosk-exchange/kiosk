import React, { Component, } from 'react'
import { Thumbnail, Button, Col } from 'react-bootstrap'

import getWeb3 from '../utils/getWeb3'
import { getPublicMarketContract } from '../utils/contracts'

class FeaturedProductsItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      price: null,
      formattedPrice: null,
      name: null
    }
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      this.initializeResolver()
    })
  }

  initializeResolver() {
    getPublicMarketContract.then(contract => {
      this.setState({ publicMarket: contract })
      contract.price(this.props.din).then((price) => {
        this.setState({ price: price.toNumber() })
        let formattedPrice = this.state.web3.fromWei(price, 'ether') + " ether"
        this.setState({ formattedPrice: formattedPrice })
      })
    })
  }

  render() {
    return (
      <div>
        <Col xs={6} md={4}>
          <Thumbnail src="https://ethereum.org/images/wallpaper-homestead.jpg" alt="242x200">
            <h3></h3>
            <p>{this.state.formattedPrice}</p>
            <p><Button bsStyle="primary">Buy</Button></p>
          </Thumbnail>
        </Col>
      </div>
    )
  }
}

 export default FeaturedProductsItem
