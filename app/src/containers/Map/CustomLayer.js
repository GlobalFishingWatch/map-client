import { connect } from 'react-redux';
import CustomLayer from 'components/Map/CustomLayer';
import { setLayerManagementModalVisibility } from 'actions/map';
import uploadCustomLayer from 'actions/customLayer';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  onCustomLayer: (payload) => {
    dispatch(uploadCustomLayer(payload.url, payload.name, payload.description));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomLayer);
