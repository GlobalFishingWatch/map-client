import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  SET_VESSEL_INFO_VISIBILITY,
  SHOW_VESSEL_CLUSTER_INFO,
  SET_TRACK_BOUNDS
} from '../actions';
import _ from 'lodash';
import VesselsTileData from '../components/Layers/VesselsTileData';
import PelagosClient from '../lib/pelagosClient';

export function setCurrentVessel(seriesGroup) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_VESSEL_DETAILS,
      payload: {}
    });
    if (!seriesGroup) {
      return;
    }
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
    };
    request.send(null);
  };
}

export function showVesselClusterInfo() {
  return {
    type: SHOW_VESSEL_CLUSTER_INFO
  };
}

export function getVesselTrack(seriesGroup, series = null, zoomToBounds = false) {
  return (dispatch, getState) => {
    const state = getState();
    const filters = state.filters;
    const startYear = new Date(filters.startDate).getUTCFullYear();
    const endYear = new Date(filters.endDate).getUTCFullYear();
    const urls = [];

    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${state.map.tilesetUrl}/\
sub/seriesgroup=${seriesGroup}/${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;0,0,0`);
    }
    const promises = [];
    for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
      promises.push(new PelagosClient().obtainTile(urls[urlIndex], state.user.token));
    }

    Promise.all(promises.map(p => p.catch(e => e)))
      .then(rawTileData => {
        const cleanData = VesselsTileData.getCleanVectorArrays(rawTileData);
        const groupedData = VesselsTileData.groupData(cleanData, [
          'latitude',
          'longitude',
          'datetime',
          'series',
          'weight'
        ]);

        dispatch({
          type: SET_VESSEL_INFO_VISIBILITY,
          payload: true
        });

        dispatch({
          type: SET_VESSEL_TRACK,
          payload: {
            seriesgroup: seriesGroup,
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

export function toggleVisibility(visibility) {
  return (dispatch) => {
    dispatch({
      type: SET_VESSEL_INFO_VISIBILITY,
      payload: visibility
    });
  };
}
