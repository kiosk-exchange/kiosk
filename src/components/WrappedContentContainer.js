import { connect } from "react-redux";
import ContentContainer from "./ContentContainer";

const mapStateToProps = state => {
	return {
		showBuyModal: state.showBuyModal
	};
};

const mapDispatchToProps = dispatch => {
	return {};
}

const WrappedContentContainer = connect(mapStateToProps, mapDispatchToProps)(ContentContainer);

export default WrappedContentContainer;