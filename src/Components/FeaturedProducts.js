import React, { Component } from 'react'
import FeaturedProductsItem from './FeaturedProductsItem'
import { Row, Col } from 'react-bootstrap'


class FeaturedProducts extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var items = []
    this.props.dins.forEach(function(din, index) {
      items.push(<FeaturedProductsItem key={index} din={din} />)
    })

    return (
      <div>
        <Col md={4} mdOffset={4}>
          <h2 className="text-center"> Featured Products </h2>
          {items}
        </Col>
      </div>
    )
  }
}

export default FeaturedProducts
