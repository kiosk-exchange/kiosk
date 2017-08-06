import React, { Component } from 'react'
import NewProduct from '../NewProduct'

import getWeb3 from '../utils/getWeb3'
import { getDINRegistry, getDINRegistrar, getENSMarket, getENS } from '../utils/contracts'
import ENSProductJSON from '../../build/contracts/PublicMarket.json'
import namehash from 'eth-ens-namehash'

class NewENSDomain extends Component {

	constructor(props) {
		super(props)

		this.state = {
			DINRegistry: null,
			DINRegistrar: null,
			ENSMarket: null,
			ENS: null
		}

		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentWillMount() {
		getWeb3.then((results) => {
			this.setState({ web3: results.web3 })
			this.getContracts(results.web3)
		})
	}

	getContracts(web3) {
		getDINRegistry(web3).then((instance) => {
			this.setState({ DINRegistry: instance })
		})

		getDINRegistrar(web3).then((instance) => {
			this.setState({ DINRegistrar: instance })
		})

		getENSMarket(web3).then((instance) => {
			this.setState({ ENSMarket: instance })
		})

		getENS(web3).then((instance) => {
			this.setState({ ENS: instance })
		})
	}

	handleSubmit(event, name, price) {
    event.preventDefault()

    const registry = this.state.DINRegistry.address
    const registrar = this.state.DINRegistrar.address
    const ENSMarket = this.state.ENSMarket.address
    const ENS = this.state.ENS.address

    // console.log(registry)
    // console.log(registrar)
    // console.log(ENSMarket)
    // console.log(ENS)
    // console.log(this.state.web3.eth.coinbase)
    // console.log(namehash(name))

    let ENSProductContract = this.state.web3.eth.contract(ENSProductJSON.abi)
    ENSProductContract.new(
    	registry.address,
    	registrar.address,
    	ENSMarket.address,
    	ENS.address,
    	this.state.web3.toWei(price),
    	namehash(name),
      {
        from: this.state.web3.eth.coinbase,
        data: ENSProductJSON.unlinked_binary,
        gas: 4700000
      }, function(error, result) {
        if (!error) { 
          console.log(result.address)
        } else {
          console.log(error)
        }
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