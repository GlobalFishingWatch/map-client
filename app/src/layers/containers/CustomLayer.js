import { connect } from 'react-redux';
import CustomLayer from 'layers/components/CustomLayer';
import { setLayerManagementModalVisibility } from 'app/appActions';
import { uploadCustomLayer } from 'layers/customLayerActions';
import { login } from 'user/userActions';


const mapStateToProps = state => ({
  error: state.customLayer.error,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  onCustomLayer: (payload) => {
    dispatch(uploadCustomLayer(payload.subtype, payload.url, payload.name, payload.description));
  },
  login: () => {
    dispatch(login());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomLayer);
