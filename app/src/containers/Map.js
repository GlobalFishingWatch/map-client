import { connect } from 'react-redux';
import _ from 'lodash';
import Map from 'components/Map';
import {
  getWorkspace,
  toggleLayerVisibility,
  setZoom,
  setCenter,
  openShareModal,
  saveWorkspace,
  deleteWorkspace,
  setShareModalError,
  setLayerInfoModal,
  setSupportModalVisibility
} from 'actions/map';
import { getVesselTrack, setCurrentVessel, showVesselClusterInfo, showNoVesselsInfo } from 'actions/vesselInfo';
import {
  SET_VESSEL_CLUSTER_CENTER, SET_VESSEL_TRACK
} from 'actions';

const mapStateToProps = (state) => ({
  map: state.map,
  vesselTrack: state.vesselInfo.track,
  trackBounds: state.vesselInfo.trackBounds,
  filters: state.filters,
  token: state.user.token,
  shareModal: state.map.shareModal,
  basemaps: state.map.basemaps,
  activeBasemap: state.map.activeBasemap,
  layerModal: state.map.layerModal,
  supportModal: state.map.supportModal
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWorkspace: () => {
    dispatch(getWorkspace(ownProps.workspaceId));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
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
  },
  setZoom: zoom => dispatch(setZoom(zoom)),
  setCenter: center => dispatch(setCenter(center)),

  openShareModal: () => {
    dispatch(openShareModal(true));
    dispatch(saveWorkspace(setShareModalError));
  },
  closeShareModal: () => {
    dispatch(openShareModal(false));
    dispatch(deleteWorkspace());
    dispatch(setShareModalError(null));
  },
  closeLayerInfoModal: () => {
    dispatch(setLayerInfoModal({
      open: false
    }));
  },
  closeSupportModal: () => {
    dispatch(setSupportModalVisibility(false));
  },
  openSupportModal: () => {
    dispatch(setSupportModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
