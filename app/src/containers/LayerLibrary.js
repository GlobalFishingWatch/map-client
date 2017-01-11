import { connect } from 'react-redux';
import LayerLibrary from 'components/LayerLibrary';
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
    // TODO add layer logic
    console.warn(layerId, 'adds layer');
  },
  removeLayer: (layerId) => {
    // TODO remove layer logic
    console.warn(layerId, 'removes layer');
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerLibrary);
