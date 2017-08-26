import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import QuantityPicker from "./QuantityPicker";

const styles = {
  radioButton: {
    marginTop: 16,
  },
};

/**
 * Dialog content can be scrollable.
 */
export default class DialogExampleScrollable extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.props.handleClose()
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Buy"
        primary={true}
        keyboardFocused={false}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title={this.props.product.name}
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
        <p>{this.props.product.DIN}</p>
        <QuantityPicker />
        <p>{this.props.product.price}</p>
        </Dialog>
      </div>
    )
  }
}