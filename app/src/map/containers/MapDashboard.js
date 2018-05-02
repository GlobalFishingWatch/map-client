import { connect } from 'react-redux';
import MapDashboard from 'map/components/MapDashboard';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  zoom: state.mapViewport.viewport.zoom,
  latitude: state.mapViewport.viewport.latitude,
  longitude: state.mapViewport.viewport.longitude
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDashboard);
