import { connect } from 'react-redux';
import { setSupportModalVisibility, setZoom } from 'actions/map';
import LeftControlPanel from 'leftControlPanel/components/LeftControlPanel';
import { openShareModal, setShareModalError } from 'share/shareActions';
import { saveWorkspace } from 'actions/workspace';

const mapStateToProps = state => ({
  maxZoom: state.map.maxZoom,
  mouseLatLong: state.map.mouseLatLong,
  userPermissions: state.user.userPermissions,
  zoom: state.map.zoom
});

const mapDispatchToProps = dispatch => ({
  openSupportModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  openShareModal: () => {
    dispatch(openShareModal(true));
    dispatch(saveWorkspace(setShareModalError));
  },
  setZoom: zoom => dispatch(setZoom(zoom))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftControlPanel);
