import { connect } from 'react-redux';
import Home from '../components/home';

const mapStateToProps = (state) => ({
  map: state.map,
  menuVisible: state.appearance.menuVisible
});
export default connect(mapStateToProps)(Home);
