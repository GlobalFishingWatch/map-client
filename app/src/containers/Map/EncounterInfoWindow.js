import { connect } from 'react-redux';
import EncounterInfoWindow from 'components/Map/EncounterInfoWindow';

const mapStateToProps = state => ({
  layerSubtype: state.heatmap.highlightedVessels.layerSubtype,
  foundVessels: state.heatmap.highlightedVessels.foundVessels,
  latLng: state.heatmap.highlightedVessels.latLng
});

export default connect(mapStateToProps, null)(EncounterInfoWindow);
