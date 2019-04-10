import { connect } from 'react-redux'
import RecentVesselsModal from 'app/recentVessels/components/RecentVesselsModal'
import { addVessel, clearVesselInfo } from 'app/vesselInfo/vesselInfoActions'
import { setRecentVesselsModalVisibility } from 'app/recentVessels/recentVesselsActions'
import { toggleLayerVisibility } from 'app/layers/layersActions'

const mapStateToProps = (state) => ({
  history: state.recentVessels.history,
  vessels: state.vesselInfo.vessels,
})

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(setRecentVesselsModalVisibility(false))
  },
  drawVessel: (tilesetId, seriesgroup) => {
    dispatch(toggleLayerVisibility(tilesetId, true))
    dispatch(clearVesselInfo())
    dispatch(
      addVessel({
        tilesetId,
        seriesgroup,
      })
    )
    dispatch(setRecentVesselsModalVisibility(false))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentVesselsModal)
