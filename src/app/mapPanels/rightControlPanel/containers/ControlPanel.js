import { connect } from 'react-redux'
import ControlPanel from 'app/mapPanels/rightControlPanel/components/ControlPanel'
import { setSearchResultVisibility } from 'app/search/searchActions'
import { togglePinnedVesselEditMode } from 'app/vesselInfo/vesselInfoActions'
import { toggleLayerPanelEditMode } from 'app/layers/layersActions'
import { setSubmenu } from 'app/mapPanels/rightControlPanel/rightControlPanelActions'
import { getLoginUrl } from 'app/user/userActions'
import { USER_PERMISSIONS } from 'app/constants'
import { hasUserActionPermission } from 'app/user/userSelectors'

const mapStateToProps = (state) => ({
  activeSubmenu: state.rightControlPanel.activeSubmenu,
  isReportStarted: state.report.layerId !== null,
  layerPanelEditMode: state.layers.layerPanelEditMode,
  layers: state.layers.workspaceLayers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  canSearch: hasUserActionPermission(USER_PERMISSIONS.search)(state),
  vessels: state.vesselInfo.vessels,
  numPinnedVessels: state.vesselInfo.vessels.filter((vessel) => vessel.pinned === true).length,
  numFilters: state.filterGroups.filterGroups.filter((filter) => filter.visible === true).length,
  encountersInfo: state.encounters.encountersInfo,
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel,
  loginUrl: getLoginUrl(),
})

const mapDispatchToProps = (dispatch) => ({
  disableSearchEditMode: () => {
    dispatch(togglePinnedVesselEditMode(false))
  },
  disableLayerPanelEditMode: () => {
    dispatch(toggleLayerPanelEditMode(false))
  },
  hideSearchResults: () => {
    dispatch(setSearchResultVisibility(false))
  },
  setSubmenu: (submenuName) => {
    dispatch(setSubmenu(submenuName))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel)
