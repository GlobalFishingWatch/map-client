import { connect } from 'react-redux';
import LayerManagement from 'layers/components/LayerManagement';
import { setLayerManagementModalVisibility } from 'actions/map';
import { toggleLayerPanelEditMode } from 'layers/layersActions';

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
