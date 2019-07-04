import { connect } from 'react-redux'
import RecentVesselItem from 'app/recentVessels/components/RecentVesselItem'
import { addVessel, clearVesselInfo } from 'app/vesselInfo/vesselInfoActions'
import { toggleLayerVisibility } from 'app/layers/layersActions'
import { setRecentVesselsModalVisibility } from 'app/recentVessels/recentVesselsActions'
import { trackRecentVesselAdded } from 'app/analytics/analyticsActions'

const mapDispatchToProps = (dispatch) => ({
  drawVessel: (vesselDetails) => {
    dispatch(trackRecentVesselAdded())
    dispatch(toggleLayerVisibility(vesselDetails.tilesetId, true))
    dispatch(clearVesselInfo())
    dispatch(
      addVessel({
        tilesetId: vesselDetails.tilesetId,
        id: vesselDetails.id,
        fromSearch: true,
      })
    )
  },
  closeRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(false))
  },
})

export default connect(
  null,
  mapDispatchToProps
)(RecentVesselItem)
