import { connect } from 'react-redux';
import ControlPanel from 'mapPanels/rightControlPanel/components/ControlPanel';
import { setSearchResultVisibility } from 'search/searchActions';
import { togglePinnedVesselEditMode } from 'actions/vesselInfo';
import { toggleLayerPanelEditMode } from 'layers/layersActions';
import { setRecentlyCreated } from 'areasOfInterest/areasOfInterestActions';
import { login } from 'user/userActions';
import { setDrawingMode } from 'actions/map';
import { setSubmenu } from 'mapPanels/rightControlPanel/rightControlPanelActions';


const mapStateToProps = state => ({
  activeSubmenu: state.rightControlPanel.activeSubmenu,
  isDrawing: state.map.isDrawing,
  isReportStarted: state.report.layerId !== null,
  layerPanelEditMode: state.layers.layerPanelEditMode,
  layers: state.layers.workspaceLayers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.vessels
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
