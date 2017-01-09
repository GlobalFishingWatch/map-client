import { connect } from 'react-redux';
import LayerLibrary from 'components/Map/LayerLibrary';
import { setLayerInfoModal, setLayerLibraryModalVisivility, toggleLayerVisibility } from 'actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(setLayerLibraryModalVisivility(false));
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerLibrary);
