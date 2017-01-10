import { connect } from 'react-redux';
import LayerLibrary from 'components/Map/LayerLibrary';
import { setLayerInfoModal, setLayerLibraryModalVisibility } from 'actions/map';
import { toggleLayerVisibility } from 'actions/layers';

const mapStateToProps = (state) => ({
  layers: state.layers
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
