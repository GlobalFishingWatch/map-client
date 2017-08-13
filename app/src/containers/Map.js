import { connect } from 'react-redux';
import Map from 'components/Map';
import {
  initGoogleMaps,
  setZoom,
  setCenter,
  deleteWorkspace,
  setLayerInfoModal,
  setSupportModalVisibility,
  setLayerManagementModalVisibility
} from 'actions/map';
import { setWelcomeModalVisibility } from 'actions/modal';
import {
  setUrlWorkspaceId,
  saveWorkspace
} from 'actions/workspace';
import { toggleLayerVisibility, confirmLayerRemoval } from 'layers/layersActions';
import { clearPolygon } from 'report/reportActions';
import { setSearchModalVisibility } from 'search/searchActions';
import { loadTimebarChartData } from 'timebar/timebarActions';
import { TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE } from 'constants';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setRecentVesselsModalVisibility } from 'recentVessels/recentVesselsActions';
import { openShareModal, setShareModalError } from 'share/shareActions';

const mapStateToProps = state => ({
  areas: state.areas.data,
  drawing: state.map.drawing,
  centerLat: state.map.center[0],
  centerLong: state.map.center[1],
  zoom: state.map.zoom,
  maxZoom: state.map.maxZoom,
  trackBounds: state.vesselInfo.trackBounds,
  token: state.user.token,
  shareModalOpenState: state.share.shareModal.open,
  basemaps: state.basemap.basemaps,
  activeBasemap: state.map.activeBasemap,
  layerModal: state.map.layerModal,
  supportModal: state.map.supportModal,
  layerManagementModal: state.map.layerManagementModal.open,
  userPermissions: state.user.userPermissions,
  searchModalOpen: state.search.searchModalOpen,
  recentVesselModalOpen: state.recentVessels.recentVesselModal.open,
  welcomeModalOpen: state.modal.welcome.open,
  layerIdPromptedForRemoval: state.layers.layerIdPromptedForRemoval,
  showMapCursorPointer: state.heatmap.highlightedVessels.isEmpty !== true && state.heatmap.highlightedVessels.clickableCluster !== true,
  showMapCursorZoom: state.heatmap.highlightedVessels.clickableCluster === true
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
