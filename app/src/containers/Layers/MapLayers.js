import { connect } from 'react-redux';
import _ from 'lodash';
import MapLayers from 'components/Layers/MapLayers';
import { getVesselTrack, setCurrentVessel, showVesselClusterInfo, showNoVesselsInfo } from 'actions/vesselInfo';
import {
  SET_VESSEL_CLUSTER_CENTER, SET_VESSEL_TRACK
} from 'actions';

const mapStateToProps = (state) => ({
  token: state.user.token,
  tilesetUrl: state.map.tilesetUrl,
  zoom: state.map.zoom,
  layers: state.map.layers,
  flag: state.filters.flag,
  timelineOverallExtent: state.filters.timelineOverallExtent,
  timelineInnerExtent: state.filters.timelineInnerExtent,
  timelineOuterExtent: state.filters.timelineOuterExtent,
  timelineOverExtent: state.filters.timelineOverExtent,
  timelinePaused: state.filters.timelinePaused,
  vesselTrack: state.vesselInfo.track,
  reportLayerId: state.report.layerId
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentVessel: (vessels, center) => {
    dispatch({
      type: SET_VESSEL_TRACK,
      payload: null
    });

    // we can get multiple points with similar series and seriesgroup, in which case
    // we should treat that as a succesful vessel query, not a cluster
    const allSeriesGroups = _.uniq(vessels.map(v => v.seriesgroup));
    const allSeries = _.uniq(vessels.map(v => v.series));

    if (vessels.length === 0) {
      // no results in this area
      // console.log('no results');
      dispatch(showNoVesselsInfo());
    } else if (allSeriesGroups.length === 1 && allSeries.length === 1 && allSeriesGroups[0] > 0) {
      // one seriesGroup, one series, and seriesGroup is > 0
      // (less than 0 means that points have been clustered server side):
      // only one valid result
      // console.log('one valid result');
      dispatch(setCurrentVessel(vessels[0].seriesgroup));
      dispatch(getVesselTrack(vessels[0].seriesgroup, vessels[0].series));
    } else {
      // multiple results
      // console.log('multiple results');
      // the following solely sets the cluster center in the state to be
      // reused later if user clicks on 'zoom to see more'
      dispatch({
        type: SET_VESSEL_CLUSTER_CENTER,
        payload: center
      });
      dispatch(showVesselClusterInfo());
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapLayers);
