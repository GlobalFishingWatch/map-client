import { connect } from 'react-redux';
import ControlPanel from 'rightControlPanel/components/ControlPanel';
import { setSearchResultVisibility } from 'search/searchActions';
import { togglePinnedVesselEditMode } from 'actions/vesselInfo';
import { toggleLayerPanelEditMode } from 'layers/layersActions';
import { setRecentlyCreated } from 'areasOfInterest/areasOfInterestActions';
import { login } from 'user/userActions';
import { openTimebarInfoModal, setDrawingMode } from 'actions/map';
import { setSubmenu } from 'rightControlPanel/rightControlPanelActions';


const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  layerPanelEditMode: state.layers.layerPanelEditMode,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.vessels,
  chartData: state.timebar.chartData,
  timelineInnerExtent: state.filters.timelineInnerExtent,
  isReportStarted: state.report.layerId !== null,
  activeSubmenu: state.rightControlPanel.activeSubmenu,
  isDrawing: state.map.isDrawing
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
  },
  setDrawingMode: (value) => {
    dispatch(setDrawingMode(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
