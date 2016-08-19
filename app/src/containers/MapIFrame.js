import { connect } from 'react-redux';
import MapIFrame from '../components/MapIFrame';

const mapStateToProps = (state, { location }) => ({
  token: state.user.token,
  workspaceId: location.query && location.query.workspace ? location.query.workspace : null
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MapIFrame);

