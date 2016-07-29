'use strict';

import {connect} from "react-redux";
import Header from "../components/shared/header";
import {login, logout} from "../actions/user";
import {getLayers} from "../actions/map";
import {setVisibleMenu} from "../actions/appearence";

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
    },
    setVisibleMenu: (visible) => {
      dispatch(setVisibleMenu(visible));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
