import { connect } from 'react-redux';
import AreasPanel from 'areasOfInterest/components/AreasPanel';

const mapStateToProps = state => ({
  isDrawing: state.map.isDrawing
});

export default connect(mapStateToProps)(AreasPanel);
