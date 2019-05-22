import { connect } from 'react-redux'
import EncountersPanel from 'app/encounters/components/EncountersPanel'
import { clearEncountersInfo } from 'app/encounters/encountersActions'

const mapStateToProps = (state) => ({
  encountersInfo: state.encounters.encountersInfo,
  infoPanelStatus: state.encounters.infoPanelStatus,
})

const mapDispatchToProps = (dispatch) => ({
  hide: () => {
    dispatch(clearEncountersInfo())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EncountersPanel)
