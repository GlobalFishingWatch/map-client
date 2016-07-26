'use strict';

import {connect} from "react-redux";
import Header from "../components/shared/header";
import {login, logout} from "../actions/user";
import {getLayers} from "../actions/map";

const mapStateToProps = (state) => {
  return {
    loggedUser: state.user.loggedUser
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    login: () => {
      dispatch(login());
    },
    logout: () => {
      dispatch(logout());
      dispatch(getLayers());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
