import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { setSearchResultVisibility } from 'actions/search';
import { togglePinnedVesselEditMode } from 'actions/vesselInfo';
import { toggleLayerPanelEditMode } from 'actions/layers';
import { setRecentlyCreated } from 'actions/areas';
import { login } from 'actions/user';
import { openTimebarInfoModal, setSubmenu } from 'actions/map';


const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  layerPanelEditMode: state.layers.layerPanelEditMode,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.vessels,
  chartData: state.timebar.chartData,
  timelineInnerExtent: state.filters.timelineInnerExtent,
  isReportStarted: state.report.layerId !== null,
  activeSubmenu: state.map.activeSubmenu
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  disableSearchEditMode: () => {
    dispatch(togglePinnedVesselEditMode(false));
  },
  disableLayerPanelEditMode: () => {
    dispatch(toggleLayerPanelEditMode(false));
  },
  hideSearchResults: () => {
    dispatch(setSearchResultVisibility(false));
  },
  openTimebarInfoModal: () => {
    dispatch(openTimebarInfoModal());
  },
  setRecentlyCreated: (value) => {
    dispatch(setRecentlyCreated(value));
  },
  setSubmenu: (submenuName) => {
    dispatch(setSubmenu(submenuName));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
