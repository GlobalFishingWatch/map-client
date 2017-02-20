import { connect } from 'react-redux';
import CustomLayer from 'components/Map/CustomLayer';
import { setLayerManagementModalVisibility } from 'actions/map';
import uploadCustomLayer from 'actions/customLayer';
import { login } from 'actions/user';


const mapStateToProps = state => ({
  error: state.customLayer.error,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  onCustomLayer: (payload) => {
    dispatch(uploadCustomLayer(payload.url, payload.name, payload.description));
  },
  login: () => {
    dispatch(login());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomLayer);
