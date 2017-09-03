import React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import QuantityPicker from "./QuantityPicker";
import Subheader from "material-ui/Subheader";
import { showBuyModal, buyNow } from "../redux/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  product: state.buyModal.product,
  totalPrice: state.buyModal.totalPrice,
  available: state.buyModal.available,
  isOpen: state.buyModal.isOpen,
  theme: state.config.theme
});

const mapDispatchToProps = dispatch => {
  return {
    onBuyNow: product => {
      dispatch(buyNow(product));
    },
    onClose: () => {
      dispatch(showBuyModal(false));
    }
  };
};

const BuyModal = ({
  product,
  totalPrice,
  available,
  isOpen,
  theme,
  onBuyNow,
  onClose
}) => {
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
      disabled={!available}
      backgroundColor={theme.blue}
      labelColor="#FFFFFF"
      fullWidth={true}
      onClick={() => onBuyNow(product)}
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

  const valueStyle = {
    width: "100%",
    padding: "0px 20px",
    textAlign: "right"
  };

  const show = (isOpen === true && totalPrice !== null && available !== null)

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
        open={show}
        onRequestClose={onClose}
        autoScrollBodyContent={true}
      >
        <div style={{ color: theme.gray }}>
          <div style={{ display: "flex" }}>
            <h2>Quantity</h2>
            <div style={valueStyle}>
              <QuantityPicker theme={theme} />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <h2>Total</h2>
            <div style={valueStyle}>
              <h2>
                {totalPrice + " KMT"}
              </h2>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyModal);