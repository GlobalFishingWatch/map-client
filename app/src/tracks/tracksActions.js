import { fitTimelineToTrack } from 'filters/filtersActions';
import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  addTracksPointsRenderingData,
  getTracksPlaybackData
} from 'utils/heatmapTileData';

export const INIT_TRACK = 'INIT_TRACK';
export const SET_TRACK = 'SET_TRACK';
export const DELETE_TRACKS = 'DELETE_TRACK';
export const SET_TRACK_VISIBILITY = 'SET_TRACK_VISIBILITY';

function _getTrackTimeExtent(data, series = null) {
  let start = Infinity;
  let end = 0;
  for (let i = 0, length = data.datetime.length; i < length; i++) {
    if (series !== null && series !== data.series[i]) {
      continue;
    }
    const time = data.datetime[i];
    if (time < start) {
      start = time;
    } else if (time > end) {
      end = time;
    }
  }
  return [start, end];
}

export function getTrack({ tilesetId, seriesgroup, series, updateTimelineBounds, color }) {
  return (dispatch, getState) => {
    const state = getState();

    const currentLayer = state.layers.workspaceLayers.find(layer => layer.tilesetId === tilesetId);
    if (!currentLayer) {
      console.warn('trying to get a vessel track on a layer that doesn\'t exist', state.layers.workspaceLayers);
      return;
    }
    const header = currentLayer.header;
    const url = header.endpoints.tracks;
    const promises = getTilePromises(url, state.user.token, header.temporalExtents, { seriesgroup });

    dispatch({
      type: INIT_TRACK,
      payload: {
        // TODO implement hue/color fallback + hue to color conversion
        // hue: 0,
        color,
        seriesgroup,
        series
      }
    });

    Promise.all(promises.map(p => p.catch(e => e)))
      .then((rawTileData) => {
        const cleanData = getCleanVectorArrays(rawTileData);

        if (!cleanData.length) {
          return;
        }
        const groupedData = groupData(cleanData, [
          'latitude',
          'longitude',
          'datetime',
          'series',
          'weight',
          'sigma'
        ]);

        const vectorArray = addTracksPointsRenderingData(groupedData);

        dispatch({
          type: SET_TRACK,
          payload: {
            seriesgroup,
            data: getTracksPlaybackData(vectorArray)
          }
        });

        if (updateTimelineBounds === true) {
          const tracksExtent = _getTrackTimeExtent(groupedData, series);
          dispatch(fitTimelineToTrack(tracksExtent));
        }
      });
  };
}

export function toggleTrackVisibility(seriesgroup) {
  return (dispatch, getState) => {
    const currentTrack = getState().tracks.tracks.find(track => track.seriesgroup === seriesgroup);
    if (currentTrack) {
      const visible = !currentTrack.visible;
      dispatch({
        type: SET_TRACK_VISIBILITY,
        payload: {
          seriesgroup,
          visible
        }
      });
    }
  };
}

export function deleteTracks(seriesgroupArray) {
  return {
    type: DELETE_TRACKS,
    payload: {
      seriesgroupArray
    }
  };
}

export function showTrack(seriesgroup) {
  return {
    type: SET_TRACK_VISIBILITY,
    payload: {
      seriesgroup,
      visible: true
    }
  };
}

export function hideTrack(seriesgroup) {
  return {
    type: SET_TRACK_VISIBILITY,
    payload: {
      seriesgroup,
      visible: true
    }
  };
}
