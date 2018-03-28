import { connect } from 'react-redux';
import { setZoom } from 'actions/map';
import LeftControlPanel from 'mapPanels/leftControlPanel/components/LeftControlPanel';
import { openShareModal, setShareModalError } from 'share/shareActions';
import { saveWorkspace } from 'workspace/workspaceActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  maxZoom: state.map.maxZoom,
  mouseLatLong: state.map.mouseLatLong,
  userPermissions: state.user.userPermissions,
  zoom: state.map.zoom
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  openShareModal: () => {
    dispatch(openShareModal(true));
    dispatch(saveWorkspace(setShareModalError));
  },
  setZoom: zoom => dispatch(setZoom(zoom))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftControlPanel);
