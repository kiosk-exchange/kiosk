import React, { Component } from 'react'
import NewProduct from '../NewProduct'

import getWeb3 from '../utils/getWeb3'
import { getDINRegistry, getDINRegistrar, getENSMarket, getENS, getENSPublicProduct } from '../utils/contracts'
import ENSProductJSON from '../../build/contracts/PublicMarket.json'
import namehash from 'eth-ens-namehash'

class NewENSDomain extends Component {

	constructor(props) {
		super(props)

		this.state = {
			web3: null,
			ENSPublicProduct: null
		}

		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentWillMount() {
		getWeb3.then((results) => {
			this.setState({ web3: results.web3 })
			getENSPublicProduct(results.web3).then((instance) => {
				this.setState({ ENSPublicProduct: instance })
			})
		})
	}

	handleSubmit(event, name, price) {
    event.preventDefault()

    const node = namehash(name)
    const priceInWei = this.state.web3.toWei(price)
    const account1 = this.state.web3.eth.coinbase

    this.state.ENSPublicProduct.addENSDomain(
    	name,
    	node, 
    	priceInWei,
    	{
    		from: account1,
    		gas: 4700000
    	}, (error, result) => {
    		console.log(result.address)
    	}
    )

    this.props.history.push('/')
  }

	render() {
		return(
			<NewProduct title="Add ENS Domain" namePlaceholder="kiosk.eth" handleSubmit={this.handleSubmit}/>
		)
	}

}

export default NewENSDomain