'use strict';

import {connect} from "react-redux";
import Map from "../components/map";
import {init, showLoading, getLayers, toggleLayerVisibility} from "../actions/map";
import {updateFilters} from "../actions/filters";

const mapStateToProps = (state) => {
  return {
    map: state.map,
    filters: state.filters,
    loggedUser: state.user.loggedUser,
    token: state.user.token,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initMapLayer: () => {
      dispatch(init());
    },
    loadMapLayer: (map) => {
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
    },
    updateFilters: (filters) => {
      dispatch(updateFilters(filters))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
