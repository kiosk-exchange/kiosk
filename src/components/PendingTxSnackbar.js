import React, { Component } from "react";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar";

const mapStateToProps = (state, ownProps) => {
  let message = "";

  switch (state.txsPending.length) {
    case 0:
      break;
    case 1:
      const tx = state.txsPending[0].substring(0, 8);
      message = `Transaction ${tx} is pending`;
      break;
    default:
      message = "Multiple transactions pending";
  }

  let succeeded = state.txSucceeded;

  return {
    open: state.txsPending > 0 && state.txSucceeded === false,
    succeeded: succeeded,
    message: message,
    theme: state.config.theme
  };
};

class PendingTxSnackbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSuccess: false
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // Don't re-render if we're resetting the component
    if (this.state.showSuccess === true && nextState.showSuccess === false) {
      return false;
    }

    return true;
  };

  render() {
    const { open, succeeded, message, theme } = this.props;

    // We need two different snackbars because of how material UI works.
    // One for pending, one for success.
    const pendingSnackbar = (
      <Snackbar
        style={{ textAlign: "center" }}
        bodyStyle={{ backgroundColor: theme.gray }}
        open={open}
        message={message}
        autoHideDuration={5000}
      />
    );

    const successSnackbar = (
      <Snackbar
        style={{ textAlign: "center" }}
        bodyStyle={{ backgroundColor: theme.green }}
        open={succeeded && this.state.showSuccess}
        message="Transaction succeeded"
        autoHideDuration={2000}
      />
    );

    // Wait for the pending snackbar to animate down before showing the success snackbar.
    if (succeeded === true && this.state.showSuccess === false) {
      setTimeout(() => {
        this.setState({ showSuccess: true });
        this.setState({ showSuccess: false });
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

export default connect(mapStateToProps)(PendingTxSnackbar);

// let message;
// let open = true;

// const pending = (open, title = "", duration = 0) => (

// );

// if (txSucceeded === true) {
//   message = "Transaction succeeded";
//   return pending(open, message, 3000); // Show for 3 seconds
// } else if (txFailed === true) {
//   message = "Transaction failed";
//   return pending(open, message, 3000); // Show for 3 seconds
// }

// switch (txsPending.length) {
//   case 0:
//     return pending(false);
//   case 1:
//     const first = txsPending[0].substring(0, 5);
//     message = `Transaction ${first} is pending.`;
//     // Allow fallthrough
//   default:
//     if (!message) {
//       message = "Multiple transactions are pending";
//     }
//     return pending(open, message, 10000); // Show for up to 10 seconds while transaction is pending
// }