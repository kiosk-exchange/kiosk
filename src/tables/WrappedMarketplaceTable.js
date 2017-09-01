import MarketplaceTable from "./MarketplaceTable";
import { connect } from "react-redux";
import { showBuyModal } from "../redux/actions";

const mapStateToProps = state => {
	return {};
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBuyClick: () => {
      dispatch(showBuyModal(ownProps.product));
    }
  };
};

const WrappedMarketplaceTable = connect(mapStateToProps, mapDispatchToProps)(MarketplaceTable);

export default WrappedMarketplaceTable;