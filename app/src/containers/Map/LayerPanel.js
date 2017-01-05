import { connect } from 'react-redux';
import LayerPanel from 'components/Map/LayerPanel';
import { toggleLayerVisibility, setLayerOpacity, setLayerHue, setLayerInfoModal } from 'actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
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
