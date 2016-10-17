import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  SET_VESSEL_VISIBILITY,
  SET_VESSEL_POSITION
} from '../actions';
import _ from 'lodash';
import PelagosClient from '../lib/pelagosClient';

export function setCurrentVessel(vesselDetails) {
  return (dispatch, getState) => {
    if (!vesselDetails) {
      dispatch({
        type: SET_VESSEL_DETAILS,
        payload: {}
      });
      return;
    }
    const state = getState();
    const token = state.user.token;
    const seriesGroup = vesselDetails.seriesgroup;
    let request;

    if (typeof XMLHttpRequest !== 'undefined') {
      request = new XMLHttpRequest();
    } else {
      throw new Error('XMLHttpRequest is disabled');
    }
    request.open(
      'GET',
      `${MAP_API_ENDPOINT}/v1/tilesets/765-tileset-nz2-tms/sub/seriesgroup=${seriesGroup}/info`,
      true
    );
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.responseType = 'application/json';
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

function groupData(vectorArray) {
  const data = vectorArray[0];
  if (vectorArray && vectorArray.length > 1) {
    for (let index = 1, length = vectorArray.length; index < length; index++) {
      if (vectorArray[index] !== null) {
        if (index === 1) {
          data.category = Array.prototype.slice.call(data.category).concat(
            Array.prototype.slice.call(vectorArray[index].category)
          );
          data.datetime = Array.prototype.slice.call(data.datetime).concat(
            Array.prototype.slice.call(vectorArray[index].datetime)
          );
          data.latitude = Array.prototype.slice.call(data.latitude).concat(
            Array.prototype.slice.call(vectorArray[index].latitude)
          );
          data.longitude = Array.prototype.slice.call(data.longitude).concat(
            Array.prototype.slice.call(vectorArray[index].longitude)
          );
          data.series = Array.prototype.slice.call(data.series).concat(
            Array.prototype.slice.call(vectorArray[index].series)
          );
          data.seriesgroup = Array.prototype.slice.call(data.seriesgroup).concat(
            Array.prototype.slice.call(vectorArray[index].seriesgroup)
          );
          data.sigma = Array.prototype.slice.call(data.sigma).concat(
            Array.prototype.slice.call(vectorArray[index].sigma)
          );
          data.weight = Array.prototype.slice.call(data.weight).concat(
            Array.prototype.slice.call(vectorArray[index].weight)
          );
        } else {
          data.category = data.category.concat(Array.prototype.slice.call(vectorArray[index].category));
          data.datetime = data.datetime.concat(Array.prototype.slice.call(vectorArray[index].datetime));
          data.latitude = data.latitude.concat(Array.prototype.slice.call(vectorArray[index].latitude));
          data.longitude = data.longitude.concat(Array.prototype.slice.call(vectorArray[index].longitude));
          data.series = data.series.concat(Array.prototype.slice.call(vectorArray[index].series));
          data.seriesgroup = data.seriesgroup.concat(Array.prototype.slice.call(vectorArray[index].seriesgroup));
          data.sigma = data.sigma.concat(Array.prototype.slice.call(vectorArray[index].sigma));
          data.weight = data.weight.concat(Array.prototype.slice.call(vectorArray[index].weight));
        }
      }
    }
  }
  return data;
}

export function getVesselTrack(seriesGroup, series = null) {
  return (dispatch, getState) => {
    const state = getState();
    const filters = state.filters;
    const startYear = new Date(filters.startDate).getUTCFullYear();
    const endYear = new Date(filters.endDate).getUTCFullYear();
    const urls = [];

    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${MAP_API_ENDPOINT}/v1/tilesets/765-tileset-nz2-tms/\
sub/seriesgroup=${seriesGroup}/${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;0,0,0`);
    }
    const promises = [];
    for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
      promises.push(new PelagosClient().obtainTile(urls[urlIndex], state.user.token));
    }

    Promise.all(promises).then((rawTileData) => {
      if (rawTileData[0]) {
        const data = groupData(rawTileData);
        dispatch({
          type: SET_VESSEL_TRACK,
          payload: {
            seriesgroup: seriesGroup,
            seriesGroupData: data,
            series: _.uniq(data.series),
            selectedSeries: series
          }
        });
      } else {
        dispatch({
          type: SET_VESSEL_TRACK,
          payload: null
        });
      }
    });
  };
}

export function toggleVisibility(visibility) {
  return (dispatch) => {
    dispatch({
      type: SET_VESSEL_VISIBILITY,
      payload: visibility
    });
  };
}

export function setVesselPosition(elem) {
  const position = elem.getBoundingClientRect();

  return (dispatch) => {
    dispatch({
      type: SET_VESSEL_POSITION,
      payload: {
        top: position.top,
        left: position.left
      }
    });
  };
}
