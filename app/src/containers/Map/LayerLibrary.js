import { connect } from 'react-redux';
import LayerLibrary from '../../components/Map/LayerLibrary';
import { addLayer, removeLayer } from '../../actions/layerLibrary';
import { setLayerInfoModal } from '../../actions/map';
import { toggleLayerVisibility } from '../../actions/layers';

const mapStateToProps = (state) => ({
  layers: state.layers
});

const mapDispatchToProps = (dispatch) => ({
  addLayer: (layerId) => {
    dispatch(addLayer(layerId));
  }, removeLayer: (layerId) => {
    dispatch(removeLayer(layerId));
  }, setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }, toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerLibrary);
