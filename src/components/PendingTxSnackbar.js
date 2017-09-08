import React, {Component} from 'react';
import { connect } from "react-redux";
import Snackbar from 'material-ui/Snackbar';

const mapStateToProps = state => ({
  txsPending: state.txsPending
});

class PendingTxSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    if (this.props.txsPending.length > 0) {
      const firstTx = this.props.txsPending[0].substring(0,5)
      let message
      if (this.props.txsPending.length > 1) {
        message = `Transaction ${firstTx} and ${this.props.txsPending.length} are pending.`
      } else {
        message = `Transaction ${firstTx} is pending.`
      }

      return (
        <div>
          <Snackbar
            open={true}
            message={message}
          />
        </div>
      );
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(PendingTxSnackbar)