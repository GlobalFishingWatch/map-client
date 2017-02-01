import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  CLEAR_VESSEL_INFO,
  SHOW_VESSEL_CLUSTER_INFO,
  SET_TRACK_BOUNDS,
  SHOW_NO_VESSELS_INFO,
  TOGGLE_VESSEL_PIN,
  ADD_VESSEL,
  SHOW_VESSEL_DETAILS,
  SET_PINNED_VESSEL_HUE,
  LOAD_PINNED_VESSEL,
  SET_PINNED_VESSEL_TITLE,
  TOGGLE_PINNED_VESSEL_EDIT_MODE,
  SET_RECENT_VESSEL_HISTORY,
  LOAD_RECENT_VESSEL_HISTORY
} from 'actions';
import { trackSearchResultClicked, trackVesselPointClicked } from 'actions/analytics';
import _ from 'lodash';
import { getCleanVectorArrays, groupData } from 'actions/helpers/heatmapTileData';
import PelagosClient from 'lib/pelagosClient';

export function setRecentVesselHistory(seriesgroup) {
  return {
    type: SET_RECENT_VESSEL_HISTORY,
    payload: {
      seriesgroup
    }
  };
}

export function loadRecentVesselHistory() {
  return {
    type: LOAD_RECENT_VESSEL_HISTORY,
    payload: null
  };
}

function setCurrentVessel(seriesgroup, fromSearch) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.user.token;
    let request;

    if (typeof XMLHttpRequest !== 'undefined') {
      request = new XMLHttpRequest();
    } else {
      throw new Error('XMLHttpRequest is disabled');
    }
    request.open(
      'GET',
      `${state.map.tilesetUrl}/sub/seriesgroup=${seriesgroup}/info`,
      true
    );
    if (token) {
      request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    request.setRequestHeader('Accept', 'application/json');
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }
      const data = JSON.parse(request.responseText);
      delete data.series;

      if (fromSearch) {
        dispatch(trackSearchResultClicked(state.map.tilesetUrl, seriesgroup));
      } else {
        dispatch(trackVesselPointClicked(state.map.tilesetUrl, seriesgroup));
      }

      dispatch({
        type: SET_VESSEL_DETAILS,
        payload: data
      });
      dispatch({
        type: SHOW_VESSEL_DETAILS,
        payload: {
          seriesgroup: data.seriesgroup
        }
      });

      dispatch(setRecentVesselHistory(data.seriesgroup));
    };
    request.send(null);
  };
}

export function setPinnedVessels(pinnedVessels) {
  return (dispatch, getState) => {
    const state = getState();
    const options = {
      Accept: '*/*'
    };

    options.headers = {
      Authorization: `Bearer ${state.user.token}`
    };

    pinnedVessels.forEach((pinnedVessel) => {
      let request;

      if (typeof XMLHttpRequest !== 'undefined') {
        request = new XMLHttpRequest();
      } else {
        throw new Error('XMLHttpRequest is disabled');
      }

      const baseURL = pinnedVessel.tilesetUrl || state.map.tilesetUrl;
      request.open(
        'GET',
        `${baseURL}/sub/seriesgroup=${pinnedVessel.seriesgroup}/info`,
        true
      );
      if (state.user.token) {
        request.setRequestHeader('Authorization', `Bearer ${state.user.token}`);
      }
      request.setRequestHeader('Accept', 'application/json');
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.responseText === 'Not Found') {
          console.warn('vessel info not found');
          return;
        }
        const data = JSON.parse(request.responseText);
        delete data.series;
        dispatch({
          type: LOAD_PINNED_VESSEL,
          payload: Object.assign({}, pinnedVessel, data)
        });

        dispatch(setRecentVesselHistory(pinnedVessel.seriesgroup));
      };
      request.send(null);
    });
  };
}

export function showVesselClusterInfo() {
  return {
    type: SHOW_VESSEL_CLUSTER_INFO
  };
}

export function showNoVesselsInfo() {
  return {
    type: SHOW_NO_VESSELS_INFO
  };
}

function getVesselTrack(seriesgroup, series = null, zoomToBounds = false) {
  return (dispatch, getState) => {
    console.warn('seriesgroup', seriesgroup, 'series', series)
    const state = getState();
    const filters = state.filters;
    const startYear = new Date(filters.timelineOverallExtent[0]).getUTCFullYear();
    const endYear = new Date(filters.timelineOverallExtent[1]).getUTCFullYear();
    const urls = [];

    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${state.map.tilesetUrl}/\
sub/seriesgroup=${seriesgroup}/${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;0,0,0`);
    }
    const promises = [];
    for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
      promises.push(new PelagosClient().obtainTile(urls[urlIndex], state.user.token));
    }

    Promise.all(promises.map(p => p.catch(e => e)))
      .then((rawTileData) => {
        const cleanData = getCleanVectorArrays(rawTileData);
        const groupedData = groupData(cleanData, [
          'latitude',
          'longitude',
          'datetime',
          'series',
          'weight'
        ]);

        console.log(groupedData)
        dispatch({
          type: SET_VESSEL_TRACK,
          payload: {
            seriesgroup,
            seriesGroupData: groupedData,
            series: _.uniq(groupedData.series),
            selectedSeries: series,
            tilesetUrl: state.map.tilesetUrl
          }
        });

        if (zoomToBounds) {
          // should this be computed server side ?
          // this is half implemented because it doesn't take into account filtering and time span
          const trackBounds = new google.maps.LatLngBounds();
          for (let i = 0, length = groupedData.latitude.length; i < length; i++) {
            trackBounds.extend(new google.maps.LatLng({ lat: groupedData.latitude[i], lng: groupedData.longitude[i] }));
          }

          dispatch({
            type: SET_TRACK_BOUNDS,
            trackBounds
          });
        }
      });
  };
}

export function addVessel(seriesgroup, series = null, zoomToBounds = false, fromSearch = false) {
  return (dispatch) => {
    dispatch({
      type: ADD_VESSEL,
      payload: {
        seriesgroup
      }
    });
    dispatch(setCurrentVessel(seriesgroup, fromSearch));
    dispatch(getVesselTrack(seriesgroup, series, zoomToBounds));
  };
}

export function clearVesselInfo() {
  return {
    type: CLEAR_VESSEL_INFO
  };
}

export function toggleActiveVesselPin() {
  return {
    type: TOGGLE_VESSEL_PIN,
    payload: {
      useCurrentlyVisibleVessel: true
    }
  };
}

export function toggleVesselPin(seriesgroup) {
  return {
    type: TOGGLE_VESSEL_PIN,
    payload: {
      seriesgroup
    }
  };
}

export function togglePinnedVesselEditMode(forceMode = null) {
  return {
    type: TOGGLE_PINNED_VESSEL_EDIT_MODE,
    payload: {
      forceMode
    }
  };
}

export function showPinnedVesselDetails(seriesgroup) {
  return (dispatch) => {
    dispatch(clearVesselInfo());
    dispatch({
      type: SHOW_VESSEL_DETAILS,
      payload: {
        seriesgroup
      }
    });

    dispatch(getVesselTrack(seriesgroup, null, true));
  };
}

export function setPinnedVesselHue(seriesgroup, hue) {
  return {
    type: SET_PINNED_VESSEL_HUE,
    payload: {
      seriesgroup,
      hue
    }
  };
}

export function setPinnedVesselTitle(seriesgroup, title) {
  return {
    type: SET_PINNED_VESSEL_TITLE,
    payload: {
      seriesgroup,
      title
    }
  };
}
