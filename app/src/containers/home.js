'use strict';

import {connect} from "react-redux";
import Home from "../components/home";

const mapStateToProps = (state) => {
  return {
    map: state.map
  };
};
export default connect(mapStateToProps)(Home);
