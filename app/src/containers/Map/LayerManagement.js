import { connect } from 'react-redux';
import LayerManagement from 'components/Map/LayerManagement';
import { setLayerManagementModalVisibility } from 'actions/map';
import { toggleLayerPanelEditMode } from 'actions/layers';

const mapStateToProps = state => ({
  layerPanelEditMode: state.layers.layerPanelEditMode,
  workspaceLayers: state.layers.workspaceLayers
});

const mapDispatchToProps = dispatch => ({
  openModal: () => {
    dispatch(setLayerManagementModalVisibility(true));
  },
  toggleLayerPanelEditMode: () => {
    dispatch(toggleLayerPanelEditMode());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerManagement);
