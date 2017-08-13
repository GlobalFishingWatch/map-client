export const SET_RECENT_VESSEL_HISTORY = 'SET_RECENT_VESSEL_HISTORY';
export const LOAD_RECENT_VESSEL_LIST = 'LOAD_RECENT_VESSEL_LIST';
export const SET_RECENT_VESSELS_VISIBILITY = 'SET_RECENT_VESSELS_VISIBILITY';

export function addVesselToRecentVesselList(seriesgroup) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.user.loggedUser == null) {
      return;
    }
    dispatch({
      type: SET_RECENT_VESSEL_HISTORY,
      payload: {
        seriesgroup
      }
    });
  };
}

export function loadRecentVesselsList() {
  return {
    type: LOAD_RECENT_VESSEL_LIST,
    payload: null
  };
}

export function setRecentVesselsModalVisibility(visibility) {
  return {
    type: SET_RECENT_VESSELS_VISIBILITY,
    payload: visibility
  };
}

