import { connect } from 'react-redux';
import EncountersPanel from 'mapPanels/rightControlPanel/components/EncountersPanel';
import { clearEncountersInfo, setEncountersInfo } from 'mapPanels/rightControlPanel/actions/encounters.js';

const mapStateToProps = state => ({
  encountersInfo: state.encounters.encountersInfo,
  infoPanelStatus: state.encounters.infoPanelStatus
});

const mapDispatchToProps = dispatch => ({
  hide: () => {
    dispatch(clearEncountersInfo());
  },
  setEncountersInfo: () => {
    dispatch(setEncountersInfo());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EncountersPanel);
