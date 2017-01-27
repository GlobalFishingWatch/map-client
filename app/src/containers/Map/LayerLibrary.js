import { connect } from 'react-redux';
import LayerLibrary from 'components/Map/LayerLibrary';
import { addLayer, removeLayer } from 'actions/layerLibrary';
import { setLayerInfoModal, setLayerManagementModalVisibility } from 'actions/map';

const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers
});

const mapDispatchToProps = dispatch => ({
  addLayer: (layerId) => {
    dispatch(addLayer(layerId));
  },
  closeModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  removeLayer: (layerId) => {
    dispatch(removeLayer(layerId));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerLibrary);
