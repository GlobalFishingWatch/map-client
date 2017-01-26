import { connect } from 'react-redux';
import Map from 'components/Map';
import {
  initGoogleMaps,
  setZoom,
  setCenter,
  openShareModal,
  saveWorkspace,
  deleteWorkspace,
  setShareModalError,
  setLayerInfoModal,
  setSupportModalVisibility,
  setLayerManagementModalVisibility,
  setRecentVesselsModalVisibility
} from 'actions/map';
import { getLayerLibrary } from 'actions/layerLibrary';
import { toggleLayerVisibility } from 'actions/layers';
import { clearPolygon } from 'actions/report';
import { setSearchModalVisibility } from 'actions/search';

const mapStateToProps = state => ({
  center: state.map.center,
  zoom: state.map.zoom,
  maxZoom: state.map.maxZoom,
  trackBounds: state.vesselInfo.trackBounds,
  token: state.user.token,
  shareModalOpenState: state.map.shareModal.open,
  basemaps: state.map.basemaps,
  activeBasemap: state.map.activeBasemap,
  layerModal: state.map.layerModal,
  supportModal: state.map.supportModal,
  layerManagementModal: state.map.layerManagementModal.open,
  userPermissions: state.user.userPermissions,
  searchModalOpen: state.search.searchModalOpen,
  recentVesselModalOpen: state.map.recentVesselModal.open
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  initMap: (googleMaps) => {
    dispatch(initGoogleMaps(googleMaps));
  },
  loadInitialState: () => {
    dispatch(getLayerLibrary(ownProps.workspaceId));
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
  closeLayerManagementModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  clearReportPolygon: () => {
    dispatch(clearPolygon());
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false));
  },
  closeRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
