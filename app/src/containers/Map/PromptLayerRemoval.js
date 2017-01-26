import { connect } from 'react-redux';
import PromptLayerRemoval from 'components/Map/PromptLayerRemoval';
import { setRecentVesselsModalVisibility } from 'actions/map';
import { toggleLayerVisibility, toggleLayerWorkspacePresence, confirmLayerRemoval } from 'actions/layers';

const mapStateToProps = state => ({
  layerIdPromptedForRemoval: state.layers.layerIdPromptedForRemoval
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  },
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
