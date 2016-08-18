import { connect } from 'react-redux';
import MapIFrame from '../components/MapIFrame';

const mapStateToProps = state => ({
  token: state.user.token
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MapIFrame);

