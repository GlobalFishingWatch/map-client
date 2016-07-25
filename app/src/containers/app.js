'use strict';

import {connect} from "react-redux";
import App from "../components/App";
import {setToken, getLoggedUser} from "../actions/user";

const mapStateToProps = (state) => {
  return {
    loading: state.map.loading
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setToken: (token) => dispatch(setToken(token)),
    getLoggedUser: () => dispatch(getLoggedUser())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
