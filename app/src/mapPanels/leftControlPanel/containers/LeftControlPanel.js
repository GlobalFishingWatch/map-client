import { connect } from 'react-redux';
import { incrementZoom, decrementZoom } from 'src/_map';
import LeftControlPanel from 'mapPanels/leftControlPanel/components/LeftControlPanel';
import { openShareModal, setShareModalError } from 'share/shareActions';
import { saveWorkspace } from 'workspace/workspaceActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  canZoomIn: state.workspace.viewport.canZoomIn,
  canZoomOut: state.workspace.viewport.canZoomOut,
  mouseLatLong: state.workspace.viewport.mouseLatLong,
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
  // TODO MAP MODULE just reset workspace props
  incrementZoom,
  decrementZoom
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftControlPanel);
