import { connect } from 'react-redux';
import Map from 'components/Map';
import {
  initGoogleMaps,
  setZoom,
  setCenter,
  openShareModal,
  deleteWorkspace,
  setShareModalError,
  setLayerInfoModal,
  setSupportModalVisibility,
  setLayerManagementModalVisibility,
  setRecentVesselsModalVisibility
} from 'actions/map';
import { setWelcomeModalVisibility } from 'actions/modal';
import {
  setUrlWorkspaceId,
  saveWorkspace
} from 'actions/workspace';
import { toggleLayerVisibility, confirmLayerRemoval } from 'actions/layers';
import { clearPolygon } from 'actions/report';
import { setSearchModalVisibility } from 'actions/search';
import { loadTimebarChartData } from 'actions/timebar';
import { TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE } from 'constants';
import { trackExternalLinkClicked } from 'actions/analytics';

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
  recentVesselModalOpen: state.map.recentVesselModal.open,
  welcomeModalOpen: state.modal.welcome.open,
  layerIdPromptedForRemoval: state.layers.layerIdPromptedForRemoval
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  initMap: (googleMaps) => {
    dispatch(initGoogleMaps(googleMaps));
  },
  loadInitialState: () => {
    dispatch(setUrlWorkspaceId(ownProps.workspaceId));
    dispatch(loadTimebarChartData(TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  setZoom: zoom => dispatch(setZoom(zoom)),
  setCenter: (center, centerWorld) => dispatch(setCenter(center, centerWorld)),

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
  },
  closeWelcomeModal: () => {
    dispatch(setWelcomeModalVisibility(false));
  },
  closeLayerRemovalModal: () => {
    dispatch(confirmLayerRemoval(false));
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
