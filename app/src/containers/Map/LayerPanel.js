import { connect } from 'react-redux';
import LayerPanel from 'components/Map/LayerPanel';
import { toggleReport } from 'actions/report';
import { toggleLayerVisibility, setLayerOpacity, setLayerHue, setLayerInfoModal } from 'actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers,
  currentlyReportedLayerId: state.report.layerId
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layerId) => {
    dispatch(toggleLayerVisibility(layerId));
  },
  setLayerOpacity: (opacity, layerId) => {
    dispatch(setLayerOpacity(opacity, layerId));
  },
  setLayerHue: (hue, layerId) => {
    dispatch(setLayerHue(hue, layerId));
  },
  toggleReport: (layerId, layerTitle) => {
    dispatch(toggleReport(layerId, layerTitle));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
