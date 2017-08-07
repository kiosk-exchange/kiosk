import React, { Component } from 'react'

class TableRowButton extends Component {

	constructor(props) {
		super(props)

		this.title = this.title.bind(this)
	}

	handleClick() {
		if (this.props.available === true) {
			this.props.handleBuy(this.props.index)
		}
	}

	title() {
		if (this.props.available === true) {
			return "Buy Now"
		}
		return "Not for Sale"
	}

	render() {
		return (
			<button className={"table-row-button-" + this.props.available} onClick={this.handleClick.bind(this)}>{this.title()}</button>
		)
	}

}

export default TableRowButton