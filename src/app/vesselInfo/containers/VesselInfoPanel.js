import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import VesselInfoPanel from 'app/vesselInfo/components/VesselInfoPanel'
import {
  clearVesselInfo,
  toggleActiveVesselPin,
  targetCurrentlyShownVessel,
} from 'app/vesselInfo/vesselInfoActions'
import { setEncountersInfo } from 'app/encounters/encountersActions'
import { setNotification } from 'app/notifications/notificationsActions'
import { getLoginUrl } from '../../user/userActions'

const getVesselInfo = (state) => state.vesselInfo.currentlyShownVessel
const getWorkspaceLayers = (state) => state.layers.workspaceLayers

const getCurrentlyShownLayer = createSelector(
  [getVesselInfo, getWorkspaceLayers],
  (vesselInfo, workspaceLayers) => {
    const currentlyShownLayer = workspaceLayers.find(
      (layer) =>
        vesselInfo &&
        (layer.tilesetId === vesselInfo.tilesetId || layer.id === vesselInfo.tilesetId)
    )
    return currentlyShownLayer
  }
)

const getLayerFieldsHeaders = createSelector(
  [getCurrentlyShownLayer],
  (currentlyShownLayer) => {
    let layerFieldsHeaders
    if (currentlyShownLayer !== undefined && currentlyShownLayer.header !== undefined) {
      if (currentlyShownLayer.header.info.fields !== undefined) {
        layerFieldsHeaders = currentlyShownLayer.header.info.fields
      }
    }
    return layerFieldsHeaders
  }
)

const getLayerIsPinnable = createSelector(
  [getCurrentlyShownLayer],
  (currentlyShownLayer) => {
    let layerIsPinnable = true
    if (currentlyShownLayer !== undefined && currentlyShownLayer.header !== undefined) {
      if (currentlyShownLayer.header.pinable === false) {
        layerIsPinnable = false
      }
    }
    return layerIsPinnable
  }
)

const mapStateToProps = (state) => ({
  loginUrl: getLoginUrl(),
  layerFieldsHeaders: getLayerFieldsHeaders(state),
  layerIsPinable: getLayerIsPinnable(state),
  vesselInfo: getVesselInfo(state),
  status: state.vesselInfo.infoPanelStatus,
  userPermissions: state.user.userPermissions,
  warningLiteral: state.literals.vessel_warning,
})

const mapDispatchToProps = (dispatch) => ({
  hide: () => {
    dispatch(clearVesselInfo())
  },
  onTogglePin: (id) => {
    dispatch(toggleActiveVesselPin(id))
  },
  showParentEncounter: (encounter) => {
    dispatch(clearVesselInfo())
    dispatch(setEncountersInfo(encounter.id, encounter.tilesetId))
  },
  targetVessel: () => {
    dispatch(targetCurrentlyShownVessel())
  },
  showWarning: (content) => {
    dispatch(
      setNotification({
        visible: true,
        type: 'warning',
        content,
      })
    )
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VesselInfoPanel)
