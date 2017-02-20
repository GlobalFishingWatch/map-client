import { connect } from 'react-redux';
import LayerPanel from 'components/Map/LayerPanel';
import { setLayerInfoModal } from 'actions/map';
import { toggleLayerVisibility, setLayerOpacity, setLayerHue } from 'actions/layers';

const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  currentlyReportedLayerId: state.report.layerId,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  toggleLayerVisibility: (layerId) => {
    dispatch(toggleLayerVisibility(layerId));
  },
  setLayerOpacity: (opacity, layerId) => {
    dispatch(setLayerOpacity(opacity, layerId));
  },
  setLayerHue: (hue, layerId) => {
    dispatch(setLayerHue(hue, layerId));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
