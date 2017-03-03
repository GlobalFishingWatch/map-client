import { connect } from 'react-redux';
import AuthMap from 'components/AuthMap';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  token: state.user.token
});

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(login())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthMap);
