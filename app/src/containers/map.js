'use strict';

import {connect} from 'react-redux';
import Map from '../components/map';

import {init, loadZoom, move, showLoading, resetCache, addLayer} from '../actions/vessel';

const mapStateToProps = (state) => {
  return {
    vessel: state.vessel
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initVesselLayer: () => {dispatch(init());},
    loadVesselLayer: (map) => {dispatch(loadZoom(map))},
    move: (map) => {dispatch(move(map))},
    showLoading: () => {dispatch(showLoading(true))},
    resetCache: () => {dispatch(resetCache())},
    addLayer: (url) => {dispatch(addLayer(url))}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
