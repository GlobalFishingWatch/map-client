import { connect } from 'react-redux';
import LayerLibrary from 'layers/components/LayerLibrary';
import { addLayer, removeLayer } from 'layers/layerLibraryActions';
import { setLayerInfoModal, setLayerManagementModalVisibility } from 'app/appActions';

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
