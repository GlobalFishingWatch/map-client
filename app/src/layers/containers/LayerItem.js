import { connect } from 'react-redux';
import LayerItem from 'layers/components/LayerItem';
import { toggleReport } from 'report/reportActions';
import { setLayerInfoModal } from 'actions/map';
import {
  toggleLayerVisibility,
  setLayerOpacity,
  setLayerHue,
  setLayerColor,
  toggleLayerWorkspacePresence,
  setLayerLabel,
  confirmLayerRemoval
} from 'layers/layersActions';
import { trackLayerOpacityChange, trackLayerHueChange, trackLayerColorChange } from 'analytics/analyticsActions';

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
    trackLayerOpacityChange(dispatch, opacity, layerId);
  },
  setLayerHue: (hue, layerId) => {
    dispatch(setLayerHue(hue, layerId));
    trackLayerHueChange(dispatch, hue, layerId);
  },
  setLayerColor: (color, layerId) => {
    dispatch(setLayerColor(color, layerId));
    trackLayerColorChange(dispatch, color, layerId);
  },
  toggleReport: (layerId) => {
    dispatch(toggleReport(layerId));
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerItem);
