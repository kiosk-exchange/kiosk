import React, {Component} from 'react';
import { connect } from "react-redux";
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

const mapStateToProps = state => ({
  txsPending: state.txsPending,
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
      return (
        <div>
          <Snackbar
            open={true}
            message="Event added to your calendar"
          />
        </div>
      );
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(PendingTxSnackbar)
