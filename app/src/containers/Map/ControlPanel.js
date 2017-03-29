import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { setSearchResulVisibility } from 'actions/search';
import { togglePinnedVesselEditMode } from 'actions/vesselInfo';
import { toggleLayerPanelEditMode } from 'actions/layers';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  layerPanelEditMode: state.layers.layerPanelEditMode,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.vessels,
  chartData: state.timebar.chartData,
  timelineInnerExtent: state.filters.timelineInnerExtent,
  isReportStarted: state.report.layerId !== null
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
    dispatch(setSearchResulVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
