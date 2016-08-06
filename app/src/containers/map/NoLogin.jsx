import { connect } from 'react-redux';
import NoLogin from '../../components/map/NoLogin';
import { login, register } from '../../actions/user';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login());
  },
  register: () => {
    dispatch(register());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoLogin);
