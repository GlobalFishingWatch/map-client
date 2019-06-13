import { connect } from 'react-redux'
import EncountersVessel from 'app/encounters/components/EncountersVessel'
import { login } from 'app/user/userActions'
import { addVesselFromEncounter, clearVesselInfo } from 'app/vesselInfo/vesselInfoActions'
import { clearEncountersInfo } from 'app/encounters/encountersActions'

const mapStateToProps = (state) => ({
  userPermissions: state.user.userPermissions,
})

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login())
  },
  openVessel: (vessel) => {
    dispatch(clearVesselInfo())
    dispatch(addVesselFromEncounter(vessel.tilesetId, vessel.id))
    dispatch(clearEncountersInfo())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EncountersVessel)
