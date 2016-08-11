import { connect } from 'react-redux';
import App from '../components/App';
import { setToken, getLoggedUser } from '../actions/user';

const mapStateToProps = (state) => ({ loading: state.map.loading });

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token)),
  getLoggedUser: () => dispatch(getLoggedUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
