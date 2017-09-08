import React from "react";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar";

const mapStateToProps = state => {
  return {
    txsPending: state.txsPending,
    txSucceeded: state.txSucceeded,
    txFailed: state.txFailed // TODO:
  };
};

const PendingTxSnackbar = ({ txsPending, txSucceeded, txFailed, onClose }) => {
  let message;
  let open = true;

  const pending = (open, title = "", duration = 0) => (
    <Snackbar
      open={open}
      message={title}
      autoHideDuration={duration}
      onRequestClose={onClose}
    />
  );

  if (txSucceeded === true) {
    message = "Transaction succeeded";
    return pending(open, message, 3000); // Show for 3 seconds
  } else if (txFailed === true) {
    message = "Transaction failed";
    return pending(open, message, 3000); // Show for 3 seconds
  }

  switch (txsPending.length) {
    case 0:
      return pending(false);
    case 1:
      const first = txsPending[0].substring(0, 5);
      message = `Transaction ${first} is pending.`;
      // Allow fallthrough
    default:
      if (!message) {
        message = "Multiple transactions are pending";
      }
      return pending(open, message, 10000); // Show for up to 10 seconds while transaction is pending
  }
};

export default connect(mapStateToProps)(PendingTxSnackbar);