'use strict';

import {connect} from "react-redux";
import Home from "../components/home";

// import {init, loadZoom, move, showLoading, resetCache, addLayer} from '../actions/vessel';

const mapStateToProps = (state) => {
  return {
    map: state.map
  };
};
export default connect(mapStateToProps)(Home);
