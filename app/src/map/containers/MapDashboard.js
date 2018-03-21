import { connect } from 'react-redux';
import MapDashboard from 'map/components/MapDashboard';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  zoom: state.mapViewport.zoom,
  latitude: state.mapViewport.latitude,
  longitude: state.mapViewport.longitude
  // activeBasemap: state.basemap.activeBasemap,
  // areas: state.areas.existingAreasOfInterest,
  // basemaps: state.basemap.basemaps,
  // isDrawing: state.map.isDrawing,
  // maxZoom: state.map.maxZoom,
  // showMapCursorPointer: state.heatmap.highlightedVessels.isEmpty !== true && state.heatmap.highlightedVessels.clickableCluster !== true,
  // showMapCursorZoom: state.heatmap.highlightedVessels.clickableCluster === true,
  // token: state.user.token,
  // trackBounds: state.vesselInfo.trackBounds,
  // userPermissions: state.user.userPermissions,
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  }
  // toggleLayerVisibility: (layer) => {
  //   dispatch(toggleLayerVisibility(layer));
  // },
  // setZoom: zoom => dispatch(setZoom(zoom)),
  // setCenter: (center, centerWorld) => dispatch(setCenter(center, centerWorld)),
  //
  // hidePolygonModal: () => {
  //   dispatch(hidePolygonModal());
  // },
  // setMouseLatLong: (lat, long) => {
  //   dispatch(setMouseLatLong(lat, long));
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDashboard);
