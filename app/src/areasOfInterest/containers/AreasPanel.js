import { connect } from 'react-redux';
import AreasPanel from 'areasOfInterest/components/AreasPanel';

const mapStateToProps = state => ({
  drawing: state.map.drawing
});

export default connect(mapStateToProps)(AreasPanel);
