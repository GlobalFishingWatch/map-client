import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';

const mapStateToProps = (state) => ({
  layers: state.layers
});

export default connect(mapStateToProps, null)(ControlPanel);
