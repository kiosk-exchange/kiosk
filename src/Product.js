import React, { Component } from 'react'
import { Grid, Row, Col, Button } from 'react-bootstrap';

class Product extends Component {

	render() {
		return ( 
			<div className="product-container">
				<Grid className="product-Image">
				  <Row>
						<Col xs={12} sm={6} md={4}>
						  <img src={this.props.imageURL} role="presentation"></img>
					  </Col>
					  <Col xs={12} sm={6} md={4}/>
					  <Col xs={12} sm={6} md={4}>
					    <h1>{this.props.name}</h1>
						  <Button bsStyle="success" bsSize="large" onClick={this.props.buyHandler}>Buy Now</Button>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}

}

export default Product;



