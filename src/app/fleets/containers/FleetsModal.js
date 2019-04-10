import { connect } from 'react-redux'
import FleetsModal from 'app/fleets/components/FleetsModal'
import {
  commitCurrentEdits,
  breakApartCurrentlyEditedFleet,
  toggleVesselInCurrentlyEditedFleet,
  setCurrentlyEditedFleetColor,
  setCurrentlyEditedFleetTitle,
} from 'app/fleets/fleetsActions'

const mapStateToProps = (state) => ({
  fleet: state.fleets.currentlyEditedFleet,
  fleets: state.fleets.fleets,
  vessels: state.vesselInfo.vessels,
})

const mapDispatchToProps = (dispatch) => ({
  onSaveClicked: () => {
    dispatch(commitCurrentEdits())
  },
  onBreakApart: () => {
    dispatch(breakApartCurrentlyEditedFleet())
  },
  onVesselChecked: (seriesgroup) => {
    dispatch(toggleVesselInCurrentlyEditedFleet(seriesgroup))
  },
  onTintChange: (color) => {
    dispatch(setCurrentlyEditedFleetColor(color))
  },
  onTitleChange: (title) => {
    dispatch(setCurrentlyEditedFleetTitle(title))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FleetsModal)
