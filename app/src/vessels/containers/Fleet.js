import { connect } from 'react-redux';
import Fleet from 'vessels/components/Fleet';
// import {
//   toggleVesselPin,
//   setPinnedVesselHue,
//   togglePinnedVesselEditMode
// } from 'vesselInfo/vesselInfoActions';

const mapDispatchToProps = dispatch => ({
//   onRemoveClicked: (seriesgroup) => {
//     dispatch(toggleVesselPin(seriesgroup));
//   },
//   togglePinnedVesselEditMode: () => {
//     dispatch(togglePinnedVesselEditMode());
//   },
//   setPinnedVesselHue: (seriesgroup, hue) => {
//     dispatch(setPinnedVesselHue(seriesgroup, hue));
//   }
});

export default connect(null, mapDispatchToProps)(Fleet);
