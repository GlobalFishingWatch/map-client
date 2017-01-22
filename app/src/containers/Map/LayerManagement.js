import { connect } from 'react-redux';
import LayerManagement from 'components/Map/LayerManagement';
import { setLayerManagementModalVisibility } from 'actions/map';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  openModal: () => {
    dispatch(setLayerManagementModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerManagement);
