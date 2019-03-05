import tbbox from '@turf/bbox';
import { targetMapVessel } from '../index';

import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  addTracksPointsRenderingData,
  getTracksPlaybackData
} from '../utils/heatmapTileData';
import { startLoader, completeLoader } from '../module/module.actions';

export const ADD_TRACK = 'ADD_TRACK';
export const UPDATE_TRACK = 'UPDATE_TRACK';
export const REMOVE_TRACK = 'REMOVE_TRACK';

const getTrackDataParsed = (geojson) => {
  const time = { start: Infinity, end: 0 };
  if (geojson && geojson.features) {
    geojson.features.forEach((feature) => {
      const hasTimes = feature.properties.coordinateProperties.times && feature.properties.coordinateProperties.times.length > 0;
      if (hasTimes) {
        feature.properties.coordinateProperties.times.forEach((datetime) => {
          if (datetime < time.start) {
            time.start = datetime;
          } else if (datetime > time.end) {
            time.end = datetime;
          }
        });
      }
    });
  }
  const bounds = tbbox(geojson);
  const geoBounds = {
    minLat: bounds[3],
    minLng: bounds[0],
    maxLat: bounds[1],
    maxLng: bounds[2]
  };
  return {
    geojson,
    geoBounds,
    timelineBounds: [time.start, time.end]
  };
};

// Deprecated tracks format parsing
const getOldTrackBoundsFormat = (data, addOffset = false) => {
  const time = {
    start: Infinity,
    end: 0
  };
  const geo = {
    minLat: Infinity,
    maxLat: -Infinity,
    minLng: Infinity,
    maxLng: -Infinity
  };
  for (let i = 0, length = data.datetime.length; i < length; i++) {
    const datetime = data.datetime[i];
    if (datetime < time.start) {
      time.start = datetime;
    } else if (datetime > time.end) {
      time.end = datetime;
    }

    const lat = data.latitude[i];
    if (lat < geo.minLat) {
      geo.minLat = lat;
    } else if (lat > geo.maxLat) {
      geo.maxLat = lat;
    }

    let lng = data.longitude[i];
    if (addOffset === true) {
      if (lng < 0) {
        lng += 360;
      }
    }
    if (lng < geo.minLng) {
      geo.minLng = lng;
    } else if (lng > geo.maxLng) {
      geo.maxLng = lng;
    }
  }

  // track crosses the antimeridian
  if (geo.maxLng - geo.minLng > 350 && addOffset === false) {
    return getOldTrackBoundsFormat(data, true);
  }

  return {
    time: [time.start, time.end],
    geo
  };
};

function loadTrack({ id, url, type, fitBoundsOnLoad, layerTemporalExtents, color }) {
  return (dispatch, getState) => {

    const state = getState();
    const loaderID = startLoader(dispatch, state);
    if ((state.map.tracks.data).find(t => t.id === id)) {
      return;
    }

    dispatch({
      type: ADD_TRACK,
      payload: {
        id,
        url,
        type,
        color,
        fitBoundsOnLoad
      }
    });
    if (type !== 'geojson') {
      // Deprecated tracks format logic to be deleted some day
      const token = state.map.module.token;
      const promises = getTilePromises(url, token, layerTemporalExtents, { seriesgroup: id });

      Promise.all(promises.map(p => p.catch(e => e)))
        .then((rawTileData) => {
          const cleanData = getCleanVectorArrays(rawTileData);

          if (!cleanData.length) {
            return;
          }
          const rawTrackData = groupData(cleanData, [
            'latitude',
            'longitude',
            'datetime',
            'series',
            'weight',
            'sigma'
          ]);

          const vectorArray = addTracksPointsRenderingData(rawTrackData);
          const bounds = getOldTrackBoundsFormat(rawTrackData);

          dispatch({
            type: UPDATE_TRACK,
            payload: {
              id,
              data: getTracksPlaybackData(vectorArray),
              geoBounds: bounds.geo,
              timelineBounds: bounds.time
            }
          });
          dispatch(completeLoader(loaderID));
        });
    } else {
      fetch(url)
        .then((res) => {
          if (res.status >= 400) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          const { geojson, geoBounds, timelineBounds } = getTrackDataParsed(data);
          dispatch({
            type: UPDATE_TRACK,
            payload: {
              id,
              data: geojson,
              geoBounds,
              timelineBounds
            }
          });
          if (fitBoundsOnLoad) {
            targetMapVessel(id);
          }
        })
        .catch(err => console.warn(err))
        .finally(() => dispatch(completeLoader(loaderID)));
    }
  };
}

const removeTrack = trackId => ({
  type: REMOVE_TRACK,
  payload: {
    trackId
  }
});

export const updateTracks = (newTracks = []) => (dispatch, getState) => {
  const prevTracks = getState().map.tracks.data;
  // add and update layers
  if (newTracks) {
    newTracks.forEach((newTrack) => {
      const trackId = newTrack.id;
      const prevTrack = prevTracks.find(t => t.id === trackId);
      if (prevTrack === undefined) {
        dispatch(loadTrack(newTrack));
      } else if (
        prevTrack.color !== newTrack.color
      ) {
        dispatch({
          type: UPDATE_TRACK,
          payload: {
            id: newTrack.id,
            color: newTrack.color
          }
        });
      }
    });
  }

  // clean up unused tracks
  prevTracks.forEach((prevTrack) => {
    if (!newTracks || !newTracks.find(t => t.id === prevTrack.id)) {
      dispatch(removeTrack(prevTrack.id));
    }
  });
};
