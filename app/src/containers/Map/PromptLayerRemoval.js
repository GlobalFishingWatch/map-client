import { connect } from 'react-redux';
import PromptLayerRemoval from 'components/Map/PromptLayerRemoval';
import { toggleLayerVisibility, toggleLayerWorkspacePresence, confirmLayerRemoval } from 'actions/layers';

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

export default connect(mapStateToProps, mapDispatchToProps)(PromptLayerRemoval);
