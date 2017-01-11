import { connect } from 'react-redux';
import Map from 'components/Map';
import {
  setZoom,
  setCenter,
  openShareModal,
  saveWorkspace,
  deleteWorkspace,
  setShareModalError,
  setLayerInfoModal,
  setSupportModalVisibility,
  setLayerLibraryModalVisibility
} from 'actions/map';
import {
  getLayerLibrary
} from 'actions/layerLibrary';
import {
  toggleLayerVisibility
} from 'actions/layers';

const mapStateToProps = (state) => ({
  center: state.map.center,
  zoom: state.map.zoom,
  trackBounds: state.vesselInfo.trackBounds,
  token: state.user.token,
  shareModalOpenState: state.map.shareModal.open,
  basemaps: state.map.basemaps,
  activeBasemap: state.map.activeBasemap,
  layerModal: state.map.layerModal,
  supportModal: state.map.supportModal,
  layerLibraryModal: state.map.layerLibraryModal.open
});

const mapDispatchToProps = (dispatch) => ({
  getLayerLibrary: () => {
    dispatch(getLayerLibrary());
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
  },
  closeLayerLibraryModal: () => {
    dispatch(setLayerLibraryModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
