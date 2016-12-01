import { connect } from 'react-redux';
import Map from '../components/Map';
import {
  getWorkspace,
  toggleLayerVisibility,
  setZoom,
  setCenter,
  openShareModal,
  saveWorkspace,
  deleteWorkspace,
  setShareModalError,
  setLayerInfoModal
} from '../actions/map';
import { setFlagFilter } from '../actions/filters';
import { getVesselTrack, setCurrentVessel } from '../actions/vesselInfo';
import { RESET_VESSEL_DETAILS } from '../actions';

const mapStateToProps = (state) => ({
  map: state.map,
  vesselTrack: state.vesselInfo.track,
  filters: state.filters,
  token: state.user.token,
  shareModal: state.map.shareModal,
  basemaps: state.map.basemaps,
  layerModal: state.map.layerModal
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWorkspace: () => {
    dispatch(getWorkspace(ownProps.workspaceId));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  updateFilters: (filters) => {
    dispatch(setFlagFilter(filters));
  },
  setCurrentVessel: (vesselInfo) => {
    dispatch({
      type: RESET_VESSEL_DETAILS,
      payload: vesselInfo
    });
    // a negative seriesgroup indicates a cluster.
    // TODO display a message to the user like in the live version
    if (vesselInfo && vesselInfo.seriesgroup > 0) {
      dispatch(setCurrentVessel(vesselInfo));
      dispatch(getVesselTrack(vesselInfo.seriesgroup, vesselInfo.series));
    } else {
      console.warn('not a valid seriesgroup');
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
