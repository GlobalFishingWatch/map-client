import { connect } from 'react-redux';
import LayerItem from 'components/Map/LayerItem';
import { toggleReport } from 'actions/report';
import { setLayerInfoModal } from 'actions/map';
import {
  toggleLayerVisibility,
  setLayerOpacity,
  setLayerHue,
  toggleLayerWorkspacePresence,
  setLayerLabel,
  confirmLayerRemoval
} from 'actions/layers';

const mapStateToProps = state => ({
  layerPanelEditMode: state.layers.layerPanelEditMode,
  currentlyReportedLayerId: state.report.layerId,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  setLayerLabel: (layerId, label) => {
    dispatch(setLayerLabel(layerId, label));
  },
  toggleLayerWorkspacePresence: (layer) => {
    if (layer.library) {
      dispatch(toggleLayerVisibility(layer.id, false));
      dispatch(toggleLayerWorkspacePresence(layer.id));
    } else {
      dispatch(confirmLayerRemoval(layer.id, true));
    }
  },
  toggleLayerVisibility: (layerId) => {
    dispatch(toggleLayerVisibility(layerId));
  },
  setLayerOpacity: (opacity, layerId) => {
    dispatch(setLayerOpacity(opacity, layerId));
  },
  setLayerHue: (hue, layerId) => {
    dispatch(setLayerHue(hue, layerId));
  },
  toggleReport: (layerId) => {
    dispatch(toggleReport(layerId));
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerItem);
