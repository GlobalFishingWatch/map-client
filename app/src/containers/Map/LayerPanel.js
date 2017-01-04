import { connect } from 'react-redux';
import LayerPanel from 'components/Map/LayerPanel';
import { toggleLayerVisibility, setLayerOpacity, setLayerInfoModal } from 'actions/map';
import { toggleReport } from 'actions/report';

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
  setLayerOpacity: (transparency, layer) => {
    dispatch(setLayerOpacity(transparency, layer));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
