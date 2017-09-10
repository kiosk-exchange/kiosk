import React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";
import { showBuyKMTModal, changeEtherContributionAmount } from "../redux/actions/actions";
import { buyKioskMarketToken } from "../redux/actions/blockchain";

import { connect } from "react-redux";

const mapStateToProps = state => ({
  totalPrice: 0,
  etherContribution: state.etherContribution,
  ETHBalance: state.config.ETHBalance,
  isOpen: state.showBuyKMTModal,
  theme: state.config.theme
});

const mapDispatchToProps = dispatch => {
  return {
    onBuyNow: amount => {
      dispatch(buyKioskMarketToken(amount))
    },
    onClose: () => {
      dispatch(showBuyKMTModal(false));
    },
    onEtherChange: value => {
      dispatch(changeEtherContributionAmount(value))
    }
  };
};

const BuyKMTModal = ({
  totalPrice,
  ETHBalance,
  isOpen,
  theme,
  onBuyNow,
  onClose,
  onEtherChange,
  etherContribution
}) => {
  const contentStyle = {
    width: "50%",
    minWidth: "500px"
  };

  const insufficientFunds = ETHBalance < totalPrice;

  const buyNow = (
    <RaisedButton
      label="Submit"
      disabled={insufficientFunds || !(etherContribution > 0)}
      backgroundColor={theme.blue}
      labelColor="#FFFFFF"
      fullWidth={true}
      onClick={() => onBuyNow(etherContribution)}
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
    fontSize: "32px"
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
    backgroundColor: theme.white,
    opacity: "10%",
    borderColor: theme.blue,
    outline: "none"
  };

  const handleInputChange = (event) => {
    onEtherChange(event.target.value);
  }

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!(/^\d+$/.test(keyValue))) {
      event.preventDefault();
    }
  }

  return (
    <Dialog
      actions={actions}
      actionsContainerStyle={{ padding: "20px 10%", textAlign: "center" }}
      modal={false}
      contentStyle={contentStyle}
      open={show}
      onRequestClose={onClose}
      autoScrollBodyContent={true}
    >
      <Subheader style={subheaderStyle}>
        Exchange Ether (ETH) for Kiosk Market Token (KMT)
      </Subheader>
      <br />
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: "2" }}>
          <form>
            <input style={inputStyle} type="text" autoFocus={true} onKeyPress={handleKeyPress} onChange={handleInputChange} />
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
          <p style={{ ...textStyle, fontWeight: "bolder", color: theme.blue }}>
            {etherContribution === 0 ? 0 : (etherContribution * 300).toLocaleString()}
          </p>
        </div>
        <div style={{ flex: "1" }}>
          <p
            style={{ ...currencyStyle, fontWeight: "bolder", color: theme.blue }}
          >
            KMT
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyKMTModal);
