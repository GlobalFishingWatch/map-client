import { connect } from 'react-redux'
import LayerItem from 'app/layers/components/LayerItem'
import { toggleReport } from 'app/report/reportActions'
import { setLayerInfoModal } from 'app/app/appActions'
import {
  toggleLayerVisibility,
  setLayerOpacity,
  setLayerTint,
  toggleLayerShowLabels,
  toggleLayerWorkspacePresence,
  setLayerLabel,
  confirmLayerRemoval,
} from 'app/layers/layersActions'
import { trackLayerOpacityChange, trackLayerHueChange } from 'app/analytics/analyticsActions'
import { USER_PERMISSIONS } from 'app/constants'
import { hasUserActionPermission } from 'app/user/userSelectors'

const mapStateToProps = (state) => ({
  layerPanelEditMode: state.layers.layerPanelEditMode,
  currentlyReportedLayerId: state.report.layerId,
  canReport: hasUserActionPermission(USER_PERMISSIONS.reporting)(state),
})

const mapDispatchToProps = (dispatch) => ({
  setLayerLabel: (layerId, label) => {
    dispatch(setLayerLabel(layerId, label))
  },
  toggleLayerWorkspacePresence: (layer) => {
    if (layer.library) {
      dispatch(toggleLayerVisibility(layer.id, false))
      dispatch(toggleLayerWorkspacePresence(layer.id))
    } else {
      dispatch(confirmLayerRemoval(layer.id, true))
    }
  },
  toggleLayerVisibility: (layerId) => {
    dispatch(toggleLayerVisibility(layerId))
  },
  setLayerOpacity: (opacity, layerId) => {
    dispatch(setLayerOpacity(opacity, layerId))
    trackLayerOpacityChange(dispatch, opacity, layerId)
  },
  setLayerTint: (color, hue, layerId) => {
    dispatch(setLayerTint(color, hue, layerId))
    trackLayerHueChange(dispatch, hue, layerId)
  },
  toggleLayerShowLabels: (layerId) => {
    dispatch(toggleLayerShowLabels(layerId))
  },
  toggleReport: (layerId) => {
    dispatch(toggleReport(layerId))
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerItem)
