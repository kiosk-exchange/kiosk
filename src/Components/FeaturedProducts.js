import React, { Component, Grid, Row, Col, Thumbnail, Button } from 'react'

import getWeb3 from '../utils/getWeb3'
import { getPublicMarketContract } from '../utils/contracts'

class FeaturedProducts extends Component {

  render() {
    return (
      <Grid>
        <Row>
          {
            this.props.dins.map(function(din) {
              return <FeaturedProductsItem din={din} />
            })
          }
        </Row>
      </Grid>
    )
  }
}

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
    <Col xs={6} md={4}>
      <Thumbnail src="/assets/thumbnaildiv.png" alt="242x200">
        <h3>Thumbnail label</h3>
        <p>Description</p>
        <p><Button bsStyle="primary">Buy</Button></p>
      </Thumbnail>
    </Col>
  }
}

// export { FeaturedProducts, FeaturedProductsItem }

export default FeaturedProducts;
