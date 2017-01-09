import { connect } from 'react-redux';
import Map from 'components/Map';
import {
  getWorkspace,
  setZoom,
  setCenter,
  openShareModal,
  saveWorkspace,
  deleteWorkspace,
  setShareModalError,
  setLayerInfoModal,
  setSupportModalVisibility
} from 'actions/map';
import {
  toggleLayerVisibility,
} from 'actions/layers';

const mapStateToProps = (state) => ({
  center: state.map.center,
  zoom: state.map.zoom,
  trackBounds: state.vesselInfo.trackBounds,
  token: state.user.token,
  shareModal: state.map.shareModal,
  basemaps: state.map.basemaps,
  activeBasemap: state.map.activeBasemap,
  layerModal: state.map.layerModal,
  supportModal: state.map.supportModal
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWorkspace: () => {
    dispatch(getWorkspace(ownProps.workspaceId));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  setZoom: zoom => dispatch(setZoom(zoom)),
  setCenter: center => dispatch(setCenter(center)),

  openShareModal: () => {
    dispatch(openShareModal(true));
    dispatch(saveWorkspace(setShareModalError));
  },
  closeShareModal: () => {
    dispatch(openShareModal(false));
    dispatch(deleteWorkspace());
    dispatch(setShareModalError(null));
  },
  closeLayerInfoModal: () => {
    dispatch(setLayerInfoModal({
      open: false
    }));
  },
  closeSupportModal: () => {
    dispatch(setSupportModalVisibility(false));
  },
  openSupportModal: () => {
    dispatch(setSupportModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
