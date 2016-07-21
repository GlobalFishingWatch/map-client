'use strict';

import {connect} from "react-redux";
import Map from "../components/map";
import {init, showLoading, getLayers, updateLayer} from "../actions/vessel";

const mapStateToProps = (state) => {
  return {
    vessel: state.vessel,
    loggedUser: state.user.loggedUser,
    token: state.user.token,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initVesselLayer: () => {
      dispatch(init());
    },
    loadVesselLayer: (map) => {
      dispatch(loadZoom(map))
    },
    showLoading: () => {
      dispatch(showLoading(true))
    },
    getLayers: () => {
      dispatch(getLayers())
    },
    updateLayer: (layer) => {
      dispatch(updateLayer(layer))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
