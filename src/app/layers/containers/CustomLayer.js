import { connect } from 'react-redux'
import CustomLayer from 'app/layers/components/CustomLayer'
import { setLayerManagementModalVisibility } from 'app/app/appActions'
import {
  resetCustomLayerForm,
  uploadCustomLayer,
  confirmCustomLayer,
} from 'app/layers/customLayerActions'
import { getLoginUrl } from 'app/user/userActions'

const mapStateToProps = (state) => ({
  loginUrl: getLoginUrl(),
  error: state.customLayer.error,
  loading: state.customLayer.status === 'pending',
  subLayers: state.customLayer.previewLayer && state.customLayer.previewLayer.subLayers,
  userPermissions: state.user.userPermissions,
})

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(setLayerManagementModalVisibility(false))
  },
  resetCustomLayer: () => {
    dispatch(resetCustomLayerForm())
  },
  onUploadCustomLayer: (payload) => {
    dispatch(uploadCustomLayer(payload.subtype, payload.url, payload.name, payload.description))
  },
  onConfirmCustomLayer: (layer) => {
    dispatch(confirmCustomLayer(layer))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomLayer)
