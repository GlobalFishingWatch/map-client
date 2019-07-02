import { connect } from 'react-redux'
import Vessel from 'app/vessels/components/Vessel'
import {
  togglePinnedVesselVisibility,
  togglePinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselColor,
  highlightTrack,
} from 'app/vesselInfo/vesselInfoActions'
import { targetMapVessel } from '@globalfishingwatch/map-components/components/map/store'
import { fitTimelineToTrack } from 'app/filters/filtersActions'
import { setNotification } from 'app/notifications/notificationsActions'

const mapStateToProps = (state) => ({
  warningLiteral: state.literals.vessel_warning,
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel,
})

const mapDispatchToProps = (dispatch) => ({
  showWarning(content) {
    dispatch(
      setNotification({
        visible: true,
        type: 'warning',
        content,
      })
    )
  },
  toggle(id) {
    dispatch(togglePinnedVesselVisibility(id))
  },
  togglePinnedVesselDetails: (id, label, tilesetId) => {
    dispatch(togglePinnedVesselDetails(id, label, tilesetId))
  },
  delete: (id) => {
    dispatch(toggleVesselPin(id))
  },
  setColor(id, color) {
    dispatch(setPinnedVesselColor(id, color))
  },
  targetVessel: (id) => {
    const timelineBounds = targetMapVessel(id)
    dispatch(fitTimelineToTrack(timelineBounds))
  },
  highlightTrack: (id) => {
    dispatch(highlightTrack(id))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vessel)
