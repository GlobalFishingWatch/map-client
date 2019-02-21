import { connect } from 'react-redux';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { toggleMapPanels } from 'app/appActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';
import MapDashboard from 'map/components/MapDashboard';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  mapPanelsExpanded: state.app.mapPanelsExpanded,
  isWorkspaceLoaded: state.workspace.isLoaded
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
