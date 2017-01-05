import { connect } from 'react-redux';
import LayerPanel from 'components/Map/LayerPanel';
import { toggleReport } from 'actions/report';
import { toggleLayerVisibility, setLayerOpacity, setLayerHue, setLayerInfoModal } from 'actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers,
  currentlyReportedLayerId: state.report.layerId
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  toggleReport: (layerId, layerTitle) => {
    dispatch(toggleReport(layerId, layerTitle));
  },
  setLayerOpacity: (opacity, layer) => {
    dispatch(setLayerOpacity(opacity, layer));
  },
  setLayerHue: (hue, layer) => {
    dispatch(setLayerHue(hue, layer));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
