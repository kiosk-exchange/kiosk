import React, { Component } from 'react'
import Market from './Market'

class ENSMarket extends Component {

	render() {
		return (
			<Market name="ENS" addProduct="Add ENS Domain" history={this.props.history} />
		)
	}

}

export default ENSMarket