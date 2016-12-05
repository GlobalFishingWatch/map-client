import { connect } from 'react-redux';
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
} from '../actions/map';
import { getVesselTrack, setCurrentVessel, showVesselClusterInfo } from '../actions/vesselInfo';
import {
  SET_VESSEL_DETAILS, SET_VESSEL_CLUSTER_CENTER, SET_VESSEL_TRACK, SET_VESSEL_INFO_VISIBILITY
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
  supportModal: state.map.supportModal
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWorkspace: () => {
    dispatch(getWorkspace(ownProps.workspaceId));
  },
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  setCurrentVessel: (vesselInfo, center) => {
    dispatch({
      type: SET_VESSEL_DETAILS,
      payload: vesselInfo
    });
    dispatch({
      type: SET_VESSEL_TRACK,
      payload: null
    });
    if (vesselInfo) {
      if (vesselInfo.seriesgroup > 0) {
        dispatch(setCurrentVessel(vesselInfo.seriesgroup));
        dispatch(getVesselTrack(vesselInfo.seriesgroup, vesselInfo.series));
      } else {
        dispatch({
          type: SET_VESSEL_CLUSTER_CENTER,
          payload: center
        });
        dispatch(showVesselClusterInfo(center));
      }
    } else {
      dispatch({
        type: SET_VESSEL_TRACK,
        payload: null
      });
      dispatch({
        type: SET_VESSEL_INFO_VISIBILITY,
        payload: false
      });
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
