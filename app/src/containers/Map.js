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
import { getVesselTrack, setCurrentVessel, showVesselClusterInfo } from '../actions/vesselInfo';
import { RESET_VESSEL_DETAILS, SET_VESSEL_CLUSTER_CENTER } from '../actions';

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
  setCurrentVessel: (vesselInfo, center) => {
    dispatch({
      type: RESET_VESSEL_DETAILS,
      payload: vesselInfo
    });
    if (vesselInfo) {
      if (vesselInfo.seriesgroup > 0) {
        dispatch(setCurrentVessel(vesselInfo));
        dispatch(getVesselTrack(vesselInfo.seriesgroup, vesselInfo.series));
      } else {
        dispatch({
          type: SET_VESSEL_CLUSTER_CENTER,
          payload: center
        });
        dispatch(showVesselClusterInfo(center));
      }
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
