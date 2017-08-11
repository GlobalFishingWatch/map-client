import { connect } from 'react-redux';
import AreasPanel from 'components/Map/AreasPanel';

const mapStateToProps = state => ({
  drawing: state.map.drawing
});

export default connect(mapStateToProps)(AreasPanel);
