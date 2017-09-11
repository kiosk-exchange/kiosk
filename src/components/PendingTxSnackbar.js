import React, { Component } from "react";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar";
import { showTxSucceeded } from "../redux/actions/blockchain";

const mapStateToProps = (state, ownProps) => {
  let message = "";

  switch (state.transactions.pending.length) {
    case 0:
      break;
    case 1:
      const tx = state.transactions.pending[0].substring(0, 8);
      message = `Transaction ${tx} is pending`;
      break;
    default:
      message = "Multiple transactions pending";
  }

  return {
    open:
      state.transactions.pending > 0 && state.transactions.success === false,
    success: state.txSucceeded,
    showSuccess:
      state.transactions.success === true &&
      state.transactions.showSuccess === true,
    message: message,
    theme: state.config.theme
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSuccess: () => {
      dispatch(showTxSucceeded(true));
    }
  };
};

class PendingTxSnackbar extends Component {
  render() {
    const {
      open,
      success,
      showSuccess,
      onSuccess,
      message,
      theme
    } = this.props;

    // We need two different snackbars because of how material UI works.
    // One for pending, one for success.
    const pendingSnackbar = (
      <Snackbar
        style={{ textAlign: "center" }}
        bodyStyle={{ backgroundColor: theme.gray }}
        open={open}
        message={message}
        autoHideDuration={15000}
      />
    );

    const successSnackbar = (
      <Snackbar
        style={{ textAlign: "center" }}
        bodyStyle={{ backgroundColor: theme.green }}
        open={showSuccess}
        message="Transaction succeeded"
        autoHideDuration={2000}
      />
    );

    // Wait for the pending snackbar to animate down before showing the success snackbar.
    if (success === true) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }

    return (
      <div>
        {pendingSnackbar}
        {successSnackbar}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingTxSnackbar);

