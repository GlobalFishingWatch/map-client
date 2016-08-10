import { connect } from 'react-redux';
import Home from '../components/Home';

const mapStateToProps = (state) => ({
  map: state.map,
  menuVisible: state.appearance.menuVisible
});
export default connect(mapStateToProps)(Home);
