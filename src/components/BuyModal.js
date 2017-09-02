import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import QuantityPicker from "./QuantityPicker";
import Subheader from "material-ui/Subheader";
import { closeBuyModal, buyNowClicked } from "../redux/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  theme: state.config.theme
});

const mapDispatchToProps = dispatch => ({
  onBuyNowClick: product => {
    dispatch(buyNowClicked);
  },
  onClose: () => {
    dispatch(closeBuyModal);
  }
});

class BuyModal extends Component {
  render() {
    const { product, isOpen, theme, onBuyNowClick, onClose } = this.props;

    if (!product) {
      return null;
    }

    const contentStyle = {
      width: "50%",
      minWidth: "300px",
      maxWidth: "400px"
    };

    const subheaderStyle = {
      color: theme.lightGray,
      letterSpacing: "1px",
      fontSize: "16px",
      fontWeight: "medium",
      padding: "0px"
    };

    // const errorStyle = {
    //   color: theme.red,
    //   fontSize: "12px",
    //   fontWeight: "medium",
    //   padding: "0px"
    // };

    const buyNow = (
      <RaisedButton
        label="Buy Now"
        disabled={!product.available}
        backgroundColor={theme.blue}
        labelColor="#FFFFFF"
        fullWidth={true}
        onClick={onBuyNowClick}
      />
    );

    let actions = [buyNow];

    // const insufficientFunds = (
    //   <Subheader style={errorStyle}>
    //     You do not have enough KMT for this purchase
    //   </Subheader>
    // );

    // if (this.props.insufficientFunds === true) {
    //   actions.push(insufficientFunds);
    // }

    return (
      <div>
        <Dialog
          title={
            <div style={{ textAlign: "center", color: theme.gray }}>
              {product.name}
              <Subheader style={subheaderStyle}>
                {product.DIN}
              </Subheader>
            </div>
          }
          actions={actions}
          actionsContainerStyle={{ padding: "20px 10%", textAlign: "center" }}
          modal={false}
          contentStyle={contentStyle}
          open={isOpen}
          onRequestClose={onClose}
          autoScrollBodyContent={true}
        >
          <div style={{ color: theme.gray }}>
            <div style={{ display: "flex" }}>
              <h2>Quantity</h2>
              <div
                style={{
                  width: "100%",
                  padding: "0px 20px",
                  textAlign: "right"
                }}
              >
                <QuantityPicker theme={theme}/>
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
                  {product.totalPrice + " KMT"}
                </h2>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyModal);