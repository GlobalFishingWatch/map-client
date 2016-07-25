'use strict';

import {connect} from "react-redux";
import Map from "../components/map";
import {init, showLoading, getLayers, toggleLayerVisibility} from "../actions/vessel";

const mapStateToProps = (state) => {
  return {
    vessel: state.vessel,
    filters: state.filters,
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
    toggleLayerVisibility: (layer) => {
      dispatch(toggleLayerVisibility(layer))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
