import { connect } from 'react-redux';
import AuthMap from '../components/AuthMap';
import { login } from '../actions/user';

const mapStateToProps = (state, { location }) => ({
  token: state.user.token,
  canRedirect: location.query && !!location.query.redirect_login,
  location
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthMap);

