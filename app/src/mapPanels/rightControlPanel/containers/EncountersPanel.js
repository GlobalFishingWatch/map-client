import { connect } from 'react-redux';
import EncountersPanel from 'mapPanels/rightControlPanel/components/EncountersPanel';
import { clearEncountersInfo } from 'mapPanels/rightControlPanel/actions/encounters';
import { addVessel } from 'actions/vesselInfo';

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
