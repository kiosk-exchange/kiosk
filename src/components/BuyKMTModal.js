import React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";
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
    minWidth: "500px"
  };

  const insufficientFunds = ETHBalance < totalPrice;

  const buyNow = (
    <RaisedButton
      label="Submit"
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

  const textStyle = {
    width: "100%",
    color: theme.gray,
    textAlign: "center",
    fontSize: "32px",
  };

  const currencyStyle = {
    width: "100%",
    color: theme.gray,
    fontSize: "32px",
    paddingLeft: "10px"
  };

  const subheaderStyle = {
    color: theme.lightGray,
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "1px"
  };

  const inputStyle = {
    width: "90%",
    height: "70px",
    fontSize: "30px",
    textAlign: "center",
    padding: "5px",
    marginTop: "9px",
    marginRight: "5px",
    borderRadius: "5px",
    border: "2px solid",
    backgroundColor: "#feeeee",
    opacity: "10%",
    borderColor: theme.red,
    outline: "none"
  };

  return (
    <div>
      <Dialog
        actions={actions}
        actionsContainerStyle={{ padding: "20px 10%", textAlign: "center" }}
        modal={false}
        contentStyle={contentStyle}
        open={show}
        onRequestClosse={onClose}
        autoScrollBodyContent={true}
      >
        <Subheader style={subheaderStyle}>Exchange Ether (ETH) for Kiosk Market Token (KMT)</Subheader>
        <br />
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: "2" }}>
            <form>
              <input style={inputStyle} type="text" autoFocus={true} />
            </form>
          </div>
          <div style={{ flex: "1" }}>
            <p style={currencyStyle}>ETH</p>
          </div>
          <div style={{ flex: "1" }}>
            <p style={textStyle}>×</p>
          </div>
          <div style={{ flex: "1" }}>
            <p style={textStyle}>300</p>
          </div>
          <div style={{ flex: "1" }}>
            <p style={textStyle}>=</p>
          </div>
          <div style={{ flex: "1" }}>
            <p style={{...textStyle, fontWeight: "bolder", color: theme.red}}>3,000</p>
          </div>
          <div style={{ flex: "1" }}>
            <p style={{...currencyStyle, fontWeight: "bolder", color: theme.red}}>KMT</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyKMTModal);