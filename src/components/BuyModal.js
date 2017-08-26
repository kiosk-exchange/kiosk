import React, { Component } from "react";
import PropTypes from "prop-types";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import QuantityPicker from "./QuantityPicker";
import Subheader from "material-ui/Subheader";

const styles = {
  radioButton: {
    marginTop: 16
  }
};

/**
 * Dialog content can be scrollable.
 */
class BuyModal extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.handleClose();
    this.setState({ open: false });
  };

  render() {
    const contentStyle = {
      width: "50%",
      minWidth: "300px",
      maxWidth: "400px"
    };

    const subheaderStyle = {
      color: "#9CA6AF",
      letterSpacing: "1px",
      fontSize: "16px",
      fontWeight: "medium",
      padding: "0px"
    };

    const actions = [
      <RaisedButton
        label="Buy Now"
        disabled={!this.props.product.available}
        backgroundColor={this.context.theme.blue}
        labelColor="#FFFFFF"
        fullWidth={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <Dialog
          title={
            <div
              style={{ textAlign: "center", color: this.context.theme.gray }}
            >
              {this.props.product.name}
              <Subheader style={subheaderStyle}>
                {this.props.product.DIN}
              </Subheader>
            </div>
          }
          actions={actions}
          actionsContainerStyle={{ padding: "20px 10%" }}
          modal={false}
          contentStyle={contentStyle}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
          <div style={{ color: this.context.theme.gray }}>
            <div style={{ display: "flex" }}>
              <h2>Quantity</h2>
              <div
                style={{
                  width: "100%",
                  padding: "0px 20px",
                  textAlign: "right"
                }}
              >
                <QuantityPicker
                  handleQuantityChange={this.props.handleQuantityChange}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <h2>Total</h2>
              <div
                style={{
                  width: "100%",
                  padding: "0px 20px",
                  textAlign: "right"
                }}
              >
                <h2>
                  {this.props.product.price + " KMT"}
                </h2>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

BuyModal.contextTypes = {
  theme: PropTypes.object
};

export default BuyModal;