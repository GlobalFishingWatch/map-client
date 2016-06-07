'use strict';

import {connect} from 'react-redux';
import Map from '../components/map';

import {init} from '../actions/vessel';

const mapStateToProps = (state) => {
  return {
    vessel: state.vessel
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initVesselLayer: () => {dispatch(init());}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
