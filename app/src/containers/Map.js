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
  setShareModalError
} from '../actions/map';
import { updateFilters } from '../actions/filters';
import { getVesselTrack, setCurrentVessel } from '../actions/vesselInfo';
import { RESET_VESSEL_DETAILS } from '../actions';

const mapStateToProps = (state) => ({
  map: state.map,
  vesselTrack: state.vesselInfo.track,
  filters: state.filters,
  loggedUser: state.user.loggedUser,
  token: state.user.token,
  shareModal: state.map.shareModal
});

const mapDispatchToProps = (dispatch, { location }) => {
  const queryParams = location.query;
  return {
    getWorkspace: () => {
      dispatch(getWorkspace(queryParams.workspace));
    },
    toggleLayerVisibility: (layer) => {
      dispatch(toggleLayerVisibility(layer));
    },
    updateFilters: (filters) => {
      dispatch(updateFilters(filters));
    },
    setCurrentVessel: (vesselInfo) => {
      dispatch({
        type: RESET_VESSEL_DETAILS,
        payload: vesselInfo
      });
      if (vesselInfo) {
        dispatch(setCurrentVessel(vesselInfo));
        dispatch(getVesselTrack(vesselInfo.seriesgroup, vesselInfo.series));
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
