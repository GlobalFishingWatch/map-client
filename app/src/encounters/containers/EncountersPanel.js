import { connect } from 'react-redux';
import EncountersPanel from 'encounters/components/EncountersPanel';
import { clearEncountersInfo } from 'encounters/encountersActions';
import { addVessel } from 'vesselInfo/vesselInfoActions';

const mapStateToProps = state => ({
  encountersInfo: state.encounters.encountersInfo,
  infoPanelStatus: state.encounters.infoPanelStatus
});

const mapDispatchToProps = dispatch => ({
  hide: () => {
    dispatch(clearEncountersInfo());
  },
  openVessel: (vesselDetails) => {
    dispatch(addVessel(vesselDetails.tilesetId, vesselDetails.seriesgroup, null, true, true));
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(EncountersPanel);
