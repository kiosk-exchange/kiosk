import React, { Component, } from 'react'
import { Thumbnail, Button, Col } from 'react-bootstrap'

import getWeb3 from '../utils/getWeb3'
import { getPublicMarketContract } from '../utils/contracts'
import productInfoABI from '../../build/contracts/ProductInfo.json'


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
      contract.info(this.props.din).then((addr) => {
        const productInfo = this.state.web3.eth.contract(productInfoABI.abi).at(addr)
        console.log(productInfo)
        productInfo.name(this.props.din, (error, name) => {
          if (!error) {
            this.setState({ name: name })
          } else {
            console.log(error)
          }
        })
      })

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
        <Col xs={6} md={6}>
          <Thumbnail src="https://ethereum.org/images/wallpaper-homestead.jpg" alt="242x200">
            <h3>{this.state.name}</h3>
            <p>{this.state.formattedPrice}</p>
            <p><a href={"/DIN/" + this.props.din}><Button bsStyle="primary" block>View</Button></a></p>
          </Thumbnail>
        </Col>
      </div>
    )
  }
}

 export default FeaturedProductsItem
