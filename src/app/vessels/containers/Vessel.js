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
  toggle(seriesgroup) {
    dispatch(togglePinnedVesselVisibility(seriesgroup))
  },
  togglePinnedVesselDetails: (seriesgroup, label, tilesetId) => {
    dispatch(togglePinnedVesselDetails(seriesgroup, label, tilesetId))
  },
  delete: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup))
  },
  setColor(seriesgroup, color) {
    dispatch(setPinnedVesselColor(seriesgroup, color))
  },
  targetVessel: (seriesgroup) => {
    const timelineBounds = targetMapVessel(seriesgroup)
    dispatch(fitTimelineToTrack(timelineBounds))
  },
  highlightTrack: (seriesgroup) => {
    dispatch(highlightTrack(seriesgroup))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vessel)
