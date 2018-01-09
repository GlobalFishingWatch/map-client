import { connect } from 'react-redux';
import MapContainer from 'components/MapContainer';
import { initGoogleMaps, setZoom, setCenter, setMouseLatLong } from 'actions/map';
import { setUrlWorkspaceId } from 'actions/workspace';
import { toggleLayerVisibility } from 'layers/layersActions';
import { hidePolygonModal } from 'report/reportActions';
import { loadTimebarChartData } from 'timebar/timebarActions';
import { TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE } from 'config';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  activeBasemap: state.basemap.activeBasemap,
  activeSubmenu: state.rightControlPanel.activeSubmenu,
  areas: state.areas.existingAreasOfInterest,
  basemaps: state.basemap.basemaps,
  centerLat: state.map.center[0],
  centerLong: state.map.center[1],
  isDrawing: state.map.isDrawing,
  maxZoom: state.map.maxZoom,
  showMapCursorPointer: state.heatmap.highlightedVessels.isEmpty !== true && state.heatmap.highlightedVessels.clickableCluster !== true,
  showMapCursorZoom: state.heatmap.highlightedVessels.clickableCluster === true,
  token: state.user.token,
  trackBounds: state.vesselInfo.trackBounds,
  userPermissions: state.user.userPermissions,
  zoom: state.map.zoom
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

  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  hidePolygonModal: () => {
    dispatch(hidePolygonModal());
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  },
  setMouseLatLong: (lat, long) => {
    dispatch(setMouseLatLong(lat, long));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
