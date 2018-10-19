import uniq from 'lodash/uniq';
import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  addTracksPointsRenderingData,
  getTracksPlaybackData
} from 'utils/heatmapTileData';
import { fitBoundsToTrack } from 'map/mapViewportActions';
import { fitTimelineToTrack } from 'filters/filtersActions';

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

export function loadTrack({ seriesgroup, series, url, layerTemporalExtents, token }) {
  return (dispatch, getState) => {

    if (getState().mapTracks.find(t => t.seriesgroup === seriesgroup && t.series === series)) {
      return;
    }

    const promises = getTilePromises(url, token, layerTemporalExtents, { seriesgroup });

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
        const bounds = getTrackBounds(rawTrackData, series);

        dispatch({
          type: ADD_TRACK,
          payload: {
            seriesgroup,
            data: getTracksPlaybackData(vectorArray),
            allSeries: uniq(rawTrackData.series),
            geoBounds: bounds.geo,
            timelineBounds: bounds.time,
            series
          }
        });
      });
  };
}

export const removeTracks = tracks => ({
  type: REMOVE_TRACKS,
  payload: {
    tracks
  }
});

export const targetVessel = (seriesgroup, series) => (dispatch, getState) => {
  const track = getState().mapTracks.find(t =>
    t.seriesgroup === seriesgroup && (series === undefined || t.series === series)
  );
  dispatch(fitBoundsToTrack(track.geoBounds));
  dispatch(fitTimelineToTrack(track.timelineBounds));
};
