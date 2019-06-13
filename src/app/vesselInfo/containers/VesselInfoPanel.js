import { connect } from 'react-redux'
import VesselInfoPanel from 'app/vesselInfo/components/VesselInfoPanel'
import {
  clearVesselInfo,
  toggleActiveVesselPin,
  targetCurrentlyShownVessel,
} from 'app/vesselInfo/vesselInfoActions'
import { setEncountersInfo } from 'app/encounters/encountersActions'
import { login } from 'app/user/userActions'
import { setNotification } from 'app/notifications/notificationsActions'

const mapStateToProps = (state) => {
  const vesselInfo = state.vesselInfo.currentlyShownVessel
  const currentlyShownLayer = state.layers.workspaceLayers.find(
    (layer) =>
      vesselInfo && (layer.tilesetId === vesselInfo.tilesetId || layer.id === vesselInfo.tilesetId)
  )

  let layerFieldsHeaders
  let layerIsPinable = true
  if (currentlyShownLayer !== undefined && currentlyShownLayer.header !== undefined) {
    if (currentlyShownLayer.header.info.fields !== undefined) {
      layerFieldsHeaders = currentlyShownLayer.header.info.fields
    }
    if (currentlyShownLayer.header.pinable === false) {
      layerIsPinable = false
    }
  }

  return {
    vesselInfo,
    layerFieldsHeaders,
    layerIsPinable,
    status: state.vesselInfo.infoPanelStatus,
    userPermissions: state.user.userPermissions,
    warningLiteral: state.literals.vessel_warning,
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login())
  },
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
