import { connect } from 'react-redux';
import Loader from 'mapPanels/leftControlPanel/components/Loader';

const mapStateToProps = state => ({
  visible: state.app.loading || (state.vesselInfo.infoPanelStatus && state.vesselInfo.infoPanelStatus.isLoading)
});

export default connect(mapStateToProps)(Loader);

