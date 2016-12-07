import { connect } from 'react-redux';
import NoLogin from 'components/Map/NoLogin';
import { login } from 'actions/user';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoLogin);
