import { connect } from 'react-redux';
import { incrementZoom, decrementZoom } from 'map/mapViewportActions';
import LeftControlPanel from 'mapPanels/leftControlPanel/components/LeftControlPanel';
import { openShareModal, setShareModalError } from 'share/shareActions';
import { saveWorkspace } from 'workspace/workspaceActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  canZoomIn: state.mapViewport.canZoomIn,
  canZoomOut: state.mapViewport.canZoomOut,
  mouseLatLong: state.mapViewport.mouseLatLong,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  openShareModal: () => {
    dispatch(openShareModal(true));
    dispatch(saveWorkspace(setShareModalError));
  },
  incrementZoom: () => dispatch(incrementZoom()),
  decrementZoom: () => dispatch(decrementZoom())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftControlPanel);
