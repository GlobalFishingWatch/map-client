import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  CLEAR_VESSEL_INFO,
  SHOW_VESSEL_CLUSTER_INFO,
  SET_TRACK_BOUNDS,
  SHOW_NO_VESSELS_INFO,
  TOGGLE_ACTIVE_VESSEL_PIN,
  ADD_VESSEL,
  SHOW_VESSEL_DETAILS,
  SET_PINNED_VESSEL_HUE
} from 'actions';
import _ from 'lodash';
import { getCleanVectorArrays, groupData } from 'actions/helpers/heatmapTileData';
import PelagosClient from 'lib/pelagosClient';


export function setCurrentVessel(seriesGroup) {
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
      `${state.map.tilesetUrl}/sub/seriesgroup=${seriesGroup}/info`,
      true
    );
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.setRequestHeader('Accept', 'application/json');
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }
      const data = JSON.parse(request.responseText);
      delete data.series;
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
    };
    request.send(null);
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

export function getVesselTrack(seriesgroup, series = null, zoomToBounds = false) {
  return (dispatch, getState) => {
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
      .then(rawTileData => {
        const cleanData = getCleanVectorArrays(rawTileData);
        const groupedData = groupData(cleanData, [
          'latitude',
          'longitude',
          'datetime',
          'series',
          'weight'
        ]);

        dispatch({
          type: SET_VESSEL_TRACK,
          payload: {
            seriesgroup,
            seriesGroupData: groupedData,
            series: _.uniq(groupedData.series),
            selectedSeries: series
          }
        });

        if (zoomToBounds) {
          // should this be computed server side ?
          // this is half implemented because it doesnt take into account filtering and time span
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


export function addVessel(seriesgroup, series = null, zoomToBounds = false) {
  return (dispatch) => {
    dispatch({
      type: ADD_VESSEL,
      payload: {
        seriesgroup
      }
    });
    dispatch(setCurrentVessel(seriesgroup));
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
    type: TOGGLE_ACTIVE_VESSEL_PIN
  };
}

export function toggleVesselPin(seriesgroup) {
  return {
    type: TOGGLE_ACTIVE_VESSEL_PIN,
    payload: {
      seriesgroup
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
