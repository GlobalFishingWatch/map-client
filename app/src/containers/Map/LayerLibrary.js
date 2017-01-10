import { connect } from 'react-redux';
import LayerLibrary from 'components/Map/LayerLibrary';
import { setLayerInfoModal, setLayerLibraryModalVisibility, toggleLayerVisibility } from 'actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(setLayerLibraryModalVisibility(false));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerLibrary);
