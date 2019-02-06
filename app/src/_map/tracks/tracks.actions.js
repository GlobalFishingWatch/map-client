import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  addTracksPointsRenderingData,
  getTracksPlaybackData
} from '../utils/heatmapTileData';
import { startLoader, completeLoader } from '../module/module.actions';


export const ADD_TRACK = 'ADD_TRACK';
export const ADD_TRACK_DATA = 'ADD_TRACK_DATA';
export const REMOVE_TRACK = 'REMOVE_TRACK';
export const UPDATE_TRACK_STYLE = 'UPDATE_TRACK_STYLE';

const getTrackBounds = (data, addOffset = false) => {
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
    return getTrackBounds(data, true);
  }

  return {
    time: [time.start, time.end],
    geo
  };
};

function loadTrack({ id, url, layerTemporalExtents, color }) {
  return (dispatch, getState) => {

    const state = getState();
    const loaderID = startLoader(dispatch, state);
    const token = state.map.module.token;

    if (state.map.tracks.find(t => t.id === id)) {
      return;
    }

    dispatch({
      type: ADD_TRACK,
      payload: {
        id,
        color
      }
    });

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
        const bounds = getTrackBounds(rawTrackData);

        dispatch({
          type: ADD_TRACK_DATA,
          payload: {
            id,
            data: getTracksPlaybackData(vectorArray),
            geoBounds: bounds.geo,
            timelineBounds: bounds.time
          }
        });
        dispatch(completeLoader(loaderID));
      });
  };
}

const removeTrack = trackId => ({
  type: REMOVE_TRACK,
  payload: {
    trackId
  }
});

export const updateTracks = newTracks => (dispatch, getState) => {
  const prevTracks = getState().map.tracks;
  // add and update layers
  newTracks.forEach((newTrack) => {
    const trackId = newTrack.id;
    const prevTrack = prevTracks.find(t => t.id === trackId);
    if (prevTrack === undefined) {
      dispatch(loadTrack(newTrack));
    } else if (
      prevTrack.color !== newTrack.color
    ) {
      dispatch({
        type: UPDATE_TRACK_STYLE,
        payload: {
          id: newTrack.id,
          color: newTrack.color
        }
      });
    }
  });

  // clean up unused tracks
  prevTracks.forEach((prevTrack) => {
    if (!newTracks.find(t => t.id === prevTrack.id)) {
      dispatch(removeTrack(prevTrack.id));
    }
  });
};
