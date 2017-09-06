import React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";
import TextField from "material-ui/TextField";
import { showBuyKMTModal } from "../redux/actions/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  totalPrice: 0,
  ETHBalance: state.config.ETHBalance,
  isOpen: state.showBuyKMTModal,
  theme: state.config.theme
});

const mapDispatchToProps = dispatch => {
  return {
    onBuyNow: () => {
      console.log("BUY KMT!");
    },
    onClose: () => {
      dispatch(showBuyKMTModal(false));
    }
  };
};

const BuyKMTModal = ({
  totalPrice,
  ETHBalance,
  isOpen,
  theme,
  onBuyNow,
  onClose
}) => {

  const contentStyle = {
    width: "50%",
    minWidth: "300px",
    maxWidth: "400px"
  };

  const insufficientFunds = ETHBalance < totalPrice;

  const buyNow = (
    <RaisedButton
      label="Buy Now"
      disabled={insufficientFunds}
      backgroundColor={theme.red}
      labelColor="#FFFFFF"
      fullWidth={true}
      onClick={() => onBuyNow()}
    />
  );

  let actions = [buyNow];

  const errorStyle = {
    color: theme.red,
    fontSize: "12px",
    fontWeight: "medium",
    padding: "0px"
  };

  const errorMessage = (
    <Subheader style={errorStyle}>
      You do not have enough ETH for this purchase
    </Subheader>
  );

  // Show an error if the user does not have enough KMT for the purchase
  if (insufficientFunds === true) {
    actions.push(errorMessage);
  }

  const show = isOpen === true;

  const KMTAmount = (
    <div style={{ display: "flex", paddingBottom: "10px" }}>
      <div style={{ display: "flex", width: "100%" }}>
        <h2>Quantity:</h2>
        <TextField
          id="Quantity"
          floatingLabelFixed={true}
          underlineFocusStyle={{ borderColor: theme.blue }}
          floatingLabelFocusStyle={{ color: theme.blue }}
        />
        <div style={{ marginLeft: "auto" }}>
          <h2>KMT</h2>
        </div>
      </div>
    </div>
  );

  const rate = (
    <div style={{ display: "flex", width: "100%", padding: "0" }}>
      <h3>x Rate:</h3>
      <div
        style={{
          marginLeft: "auto",
          borderStyleBottom: "solid",
          borderWidth: "1px",
          borderColor: theme.gray
        }}
      >
        <h3>300 KMT / ETH</h3>
      </div>
    </div>
  );

  const total = (
    <div style={{ display: "flex", width: "100%" }}>
      <h2>Total Price:</h2>
      <div style={{ marginLeft: "auto" }}>
        <h2>
          {totalPrice + " ETH"}
        </h2>
      </div>
    </div>
  );

  return (
    <div>
      <Dialog
        title={
          <div style={{ textAlign: "center" }}>Kiosk Market Token (KMT)</div>
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
          {KMTAmount}
          {rate}
          {total}
        </div>
      </Dialog>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyKMTModal);