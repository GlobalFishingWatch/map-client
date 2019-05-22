import { connect } from 'react-redux'
import { trackExternalLinkClicked } from 'app/analytics/analyticsActions'
import { toggleMapPanels } from 'app/app/appActions'
import { setSupportModalVisibility } from 'app/siteNav/supportFormActions'
import MapDashboard from 'app/map/components/MapDashboard'

const mapStateToProps = (state) => ({
  isEmbedded: state.app.isEmbedded,
  mapPanelsExpanded: state.app.mapPanelsExpanded,
  isWorkspaceLoaded: state.workspace.isLoaded,
})

const mapDispatchToProps = (dispatch) => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true))
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link))
  },
  onToggleMapPanelsExpanded: () => {
    dispatch(toggleMapPanels())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapDashboard)
