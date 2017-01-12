import { connect } from 'react-redux';
import LayerLibrary from 'components/LayerLibrary';
import { addLayer, removeLayer } from 'actions/layerLibrary';
import { setLayerInfoModal, setLayerLibraryModalVisibility } from 'actions/map';
import { toggleLayerVisibility } from 'actions/layers';

const mapStateToProps = (state) => ({
  layers: state.layerLibrary.layers
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(setLayerLibraryModalVisibility(false));
  },
  addLayer: (layerId) => {
    dispatch(addLayer(layerId));
  },
  removeLayer: (layerId) => {
    dispatch(removeLayer(layerId));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerLibrary);
