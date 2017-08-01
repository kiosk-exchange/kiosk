import React, { Component } from 'react'

import { Grid, Row, Col, Alert } from 'react-bootstrap';

import getWeb3 from '../utils/getWeb3'
import { getPublicMarketContract, getDINRegistryContract } from '../utils/contracts'


class ProductView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      publicMarket: null,
      owner: null,
      name: null,
      imageURL: null,
      price: null,
      formattedPrice: null,
      validDIN: true
    }

    this.buyHandler = this.buyHandler.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Initialize the registry and resolver contracts once web3 provided.
      this.initializeRegistry()
    })
  }

  initializeRegistry() {
    getDINRegistryContract.then(registry => {
      registry.owner(this.props.din).then((owner) => {
        this.setState({ owner: owner })
        if (owner === "0x0000000000000000000000000000000000000000") {
          this.setState({ validDIN: false })
        } else {
          this.initializeResolver()
        }
      })
    })
  }

  initializeResolver() {
    getPublicMarketContract.then(contract => {
      this.setState({ publicMarket: contract })
      contract.price(this.props.din).then((price) => {
        console.log("Price: " + price + " wei")

        this.setState({ price: price.toNumber() })

        let formattedPrice = this.state.web3.fromWei(price, 'ether') + " ether"
        this.setState({ formattedPrice: formattedPrice })
      })
    })
  }

  buyHandler() {
    var account1 = this.state.web3.eth.accounts[0]

    this.state.publicMarket.contract.buy(this.props.din, 1, {from: account1, value: this.state.price, gas: 4700000}, (error, result) => {
      if (!error) {
        console.log(result)
      } else {
        console.log(error)
      }
    })
  }

  render() {
    if (this.state.validDIN) {
      return (
        <div className="container-product">
          <Grid>

            <Row className="show-grid">

                <Col xs={8} xsOffset={2} sm={6} smOffset={0} md={6} mdOffset={0}>
                  <div className="column-product-image">
                      <img src={this.state.imageURL} role="presentation"></img>
                  </div>
                </Col>

              <div className="column-product-info">
                <Col xs={8} xsOffset={2} sm={6} smOffset={0} md={6} mdOffset={0}>
                  <div className="container-product-info">
                    <h1>{this.state.name}</h1>
                    <h2>{this.state.formattedPrice}</h2>
                    <br />
                    <button onClick={this.buyHandler}>Buy Now</button>
                  </div>
                </Col>
              </div>

            </Row>

          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          <Col mdOffset={2} xs={8} md={8}>
            <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <h4>There was an error</h4>
              <p>This isn't a valid DIN</p>
              <p>You may search for another DIN <a href='/'>here</a>, or register a new DIN <a href='/products/new'>here</a>.</p>
            </Alert>
          </Col>
        </div>
      )
    }
  }
}

export default ProductView;
