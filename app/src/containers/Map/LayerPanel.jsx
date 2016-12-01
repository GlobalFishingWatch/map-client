import { connect } from 'react-redux';
import LayerPanel from '../../components/Map/LayerPanel';
import { toggleLayerVisibility, setLayerOpacity, setLayerInfoModal } from '../../actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  setLayerOpacity: (transparency, layer) => {
    dispatch(setLayerOpacity(transparency, layer));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
