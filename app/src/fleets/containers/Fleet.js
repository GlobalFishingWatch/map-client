import { connect } from 'react-redux';
import Fleet from 'fleets/components/Fleet';
import {
  toggleFleetVisibility
} from 'fleets/fleetsActions';

const mapDispatchToProps = dispatch => ({
  toggle(id) {
    dispatch(toggleFleetVisibility(id));
  }
});

export default connect(mapDispatchToProps, mapDispatchToProps)(Fleet);
