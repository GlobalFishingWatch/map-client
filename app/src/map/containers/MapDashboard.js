import { connect } from 'react-redux';
import MapDashboard from 'map/components/MapDashboard';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';
import { toggleMapPanels } from 'app/appActions';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  zoom: state.mapViewport.viewport.zoom,
  latitude: state.mapViewport.viewport.latitude,
  longitude: state.mapViewport.viewport.longitude,
  attributions: state.mapStyle.attributions,
  mapPanelsExpanded: state.app.mapPanelsExpanded,
  hoverPopup: state.mapInteraction.hoverPopup,
  workspace: state.workspace
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  },
  onToggleMapPanelsExpanded: () => {
    dispatch(toggleMapPanels());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDashboard);
