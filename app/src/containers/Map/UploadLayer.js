import { connect } from 'react-redux';
import UploadLayer from 'components/Map/UploadLayer';
import { setLayerManagementModalVisibility } from 'actions/map';
import uploadLayer from 'actions/customLayer';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  onUploadLayer: (payload) => {
    dispatch(uploadLayer(payload.url, payload.name, payload.description));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadLayer);
