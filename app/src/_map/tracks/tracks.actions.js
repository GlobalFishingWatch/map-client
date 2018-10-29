import uniq from 'lodash/uniq';
import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  addTracksPointsRenderingData,
  getTracksPlaybackData
} from 'utils/heatmapTileData';
import { startLoader, completeLoader } from '../module/module.actions';


export const ADD_TRACK = 'ADD_TRACK';
export const REMOVE_TRACKS = 'REMOVE_TRACKS';

const getTrackBounds = (data, series = null, addOffset = false) => {
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
    if (series !== null && series !== data.series[i]) {
      continue;
    }
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
    return getTrackBounds(data, series, true);
  }

  return {
    time: [time.start, time.end],
    geo
  };
};

export function loadTrack({ id, segmentId, layerUrl, layerTemporalExtents }) {
  return (dispatch, getState) => {

    const state = getState();
    const loaderID = startLoader(dispatch, state);
    const token = state.map.module.token;

    if (state.map.tracks.find(t => t.id === id && t.segmentId === segmentId)) {
      return;
    }

    const promises = getTilePromises(layerUrl, token, layerTemporalExtents, { seriesgroup: id });

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
        const bounds = getTrackBounds(rawTrackData, segmentId);

        dispatch({
          type: ADD_TRACK,
          payload: {
            id,
            data: getTracksPlaybackData(vectorArray),
            allSegmentIds: uniq(rawTrackData.series),
            geoBounds: bounds.geo,
            timelineBounds: bounds.time,
            segmentId
          }
        });
        dispatch(completeLoader(loaderID));
      });
  };
}

export const removeTracks = tracks => ({
  type: REMOVE_TRACKS,
  payload: {
    tracks
  }
});
