import { connect } from 'react-redux';
import PromptLayerRemovalModal from 'components/Map/PromptLayerRemovalModal';
import { toggleLayerVisibility, toggleLayerWorkspacePresence, confirmLayerRemoval } from 'layers/layersActions';

const mapStateToProps = state => ({
  layerIdPromptedForRemoval: state.layers.layerIdPromptedForRemoval
});

const mapDispatchToProps = dispatch => ({
  keepLayer: () => {
    dispatch(confirmLayerRemoval(false));
  },
  removeLayer: (layerId) => {
    dispatch(toggleLayerVisibility(layerId, false));
    dispatch(toggleLayerWorkspacePresence(layerId));
    dispatch(confirmLayerRemoval(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PromptLayerRemovalModal);
