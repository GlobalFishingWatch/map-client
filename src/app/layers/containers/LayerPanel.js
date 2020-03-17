import { connect } from 'react-redux'
import LayerPanel from 'app/layers/components/LayerPanel'
import { setLayerInfoModal } from 'app/app/appActions'
import { toggleLayerVisibility } from 'app/layers/layersActions'

const mapStateToProps = (state) => ({
  layers: state.layers.workspaceLayers,
  currentlyReportedLayerId: state.report.layerId,
  isVesselInfoPanelOpen:
    state.vesselInfo.currentlyShownVessel !== null &&
    state.vesselInfo.currentlyShownVessel !== undefined,
})

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layerId) => {
    dispatch(toggleLayerVisibility(layerId))
  },
  setLayerInfoModal: (open) => {
    dispatch(setLayerInfoModal(open))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerPanel)
